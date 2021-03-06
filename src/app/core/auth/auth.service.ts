import { Actions } from '@ngrx/effects';
import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IAppState } from '../state/state.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class AuthService implements CanActivate {
  static readonly AUTH_TOKEN     = 'auth/token';
  static readonly LANGUAGE_TOKEN = 'auth/language';

  static readonly URL_LOGIN   = '/login';

  static readonly JWT_EXPIRATION_THRESHOLD = 60e3;
  static readonly JWT_TIMER_INTERVAL       = 10e3;

  static readonly AUTH_INIT            = 'AUTH_INIT';
  static readonly AUTH_LOGIN           = 'AUTH_LOGIN';
  static readonly AUTH_LOGIN_SUCCESS   = 'AUTH_LOGIN_SUCCESS';
  static readonly AUTH_REFRESH         = 'AUTH_REFRESH';
  static readonly AUTH_LOGOUT          = 'AUTH_LOGOUT';
  static readonly AUTH_CREATE_SESSION  = 'AUTH_CREATE_SESSION';
  static readonly AUTH_DESTROY_SESSION = 'AUTH_DESTROY_SESSION';
  static readonly AUTH_GLOBAL_RESET    = 'AUTH_GLOBAL_RESET';
  static readonly AUTH_RETRIEVE_TOKEN  = 'AUTH_RETRIEVE_TOKEN';
  static readonly AUTH_TOKEN_INVALID   = 'AUTH_TOKEN_INVALID';

  static readonly USER_FETCH           = 'USER_FETCH';
  static readonly USER_FETCH_SUCCESS   = 'USER_FETCH_SUCCESS';

  private tokenTimer = null;

  private readonly token$ = this.store.pipe(
    select(state => state.auth.token),
  );

  constructor(
    private actions: Actions,
    private jwtHelper: JwtHelperService,
    private persistenceService: PersistenceService,
    private router: Router,
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private zone: NgZone,
  ) {
    if (!this.isRetrievedTokenValid()) {
      this.router.navigate([ AuthService.URL_LOGIN ]);
    }

    combineLatest(
      this.actions.ofType(AuthService.AUTH_INIT),
      this.currentUser$.filter(Boolean)
    )
    .pipe(first())
    .subscribe(() => this.refreshUserParamsAction());
  }

  readonly currentUser$ = this.token$.pipe(
    map(token => token && this.jwtHelper.decodeToken(token)),
    map(tokenInfo => tokenInfo && { userId: tokenInfo.userId, userName: tokenInfo.username }),
  );

  readonly userParams$ = this.store.pipe(
    select(store => store.auth.params),
  );

  readonly validToken$ = this.token$.pipe(
    map(token => this.isTokenValid(token) ? token : null),
  );

  canActivate(): Observable<boolean> {
    return this.token$.map(token => this.isTokenValid(token) || this.isRetrievedTokenValid());
  }

  dispatchLoginAction(login: string, password: string): void {
    const action = this.createAction(AuthService.AUTH_LOGIN, { login, password });
    this.store.dispatch(action);
  }

  dispatchLogoutAction(): void {
    const action = this.createAction(AuthService.AUTH_LOGOUT);
    this.store.dispatch(action);
  }

  dispatchRefreshAction(): void {
    const action = this.createAction(AuthService.AUTH_REFRESH);
    this.store.dispatch(action);
  }

  dispatchResetAction(url: string = null): void {
    const action = this.createAction(AuthService.AUTH_DESTROY_SESSION, { url });
    this.store.dispatch(action);
  }

  dispatchInvalidTokenAction(): void {
    this.store.dispatch(this.createAction(AuthService.AUTH_TOKEN_INVALID));
  }

  redirectToLogin(): void {
    location.href = AuthService.URL_LOGIN;
  }

  saveToken(token: string): void {
    this.persistenceService.set(AuthService.AUTH_TOKEN, token);
  }

  removeToken(): void {
    this.persistenceService.remove(AuthService.AUTH_TOKEN);
  }

  saveLanguage(token: string): void {
    const { language } = this.jwtHelper.decodeToken(token);
    this.translateService.setDefaultLang(language || 'en');
    this.translateService.use(language).subscribe();
    this.persistenceService.set(AuthService.LANGUAGE_TOKEN, language);
  }

  initTokenTimer(token: string): void {
    this.zone.runOutsideAngular(() => {
      this.clearTokenTimer();
      this.tokenTimer = setInterval(() => this.onTimer(token), AuthService.JWT_TIMER_INTERVAL);
    });
  }

  clearTokenTimer(): void {
    if (this.tokenTimer) {
      clearInterval(this.tokenTimer);
    }
  }

  isRetrievedTokenValid(): boolean {
    const token = this.persistenceService.get(AuthService.AUTH_TOKEN);
    const isValid = this.isTokenValid(token);
    if (isValid) {
      this.store.dispatch({ type: AuthService.AUTH_RETRIEVE_TOKEN, payload: { token } });
    }
    return isValid;
  }

  private refreshUserParamsAction(): void {
    this.store.dispatch(this.createAction(AuthService.USER_FETCH));
  }

  private onTimer(token: string): void {
    const timeUntilExpiration = this.jwtHelper.getTokenExpirationDate(token).getTime() - Date.now();
    if (timeUntilExpiration < AuthService.JWT_EXPIRATION_THRESHOLD) {
      this.zone.run(() => {
        if (this.isTokenValid(token)) {
          this.dispatchRefreshAction();
        } else {
          this.dispatchResetAction();
        }
      });
    }
  }

  private createAction(type: string, payload: object = {}): UnsafeAction {
    return { type, payload };
  }

  private isTokenValid(token: string): boolean {
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }
}
