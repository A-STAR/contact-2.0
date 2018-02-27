import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { tap, distinctUntilChanged, map } from 'rxjs/operators';

import { IAppState } from '../state/state.interface';
import { IUser, IUserParams } from './auth.interface';
import { UnsafeAction } from '../../core/state/state.interface';

import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class AuthService implements CanActivate {
  static TOKEN_NAME = 'auth/token';
  static LANGUAGE_TOKEN = 'auth/language';

  static URL_DEFAULT = '/';
  static URL_LOGIN   = '/login';

  static JWT_EXPIRATION_THRESHOLD = 60e3;
  static JWT_TIMER_INTERVAL       = 10e3;

  static AUTH_LOGIN           = 'AUTH_LOGIN';
  static AUTH_LOGIN_SUCCESS   = 'AUTH_LOGIN_SUCCESS';
  static AUTH_REFRESH         = 'AUTH_REFRESH';
  static AUTH_LOGOUT          = 'AUTH_LOGOUT';
  static AUTH_CREATE_SESSION  = 'AUTH_CREATE_SESSION';
  static AUTH_DESTROY_SESSION = 'AUTH_DESTROY_SESSION';
  static AUTH_GLOBAL_RESET    = 'AUTH_GLOBAL_RESET';
  static AUTH_RETRIEVE_TOKEN  = 'AUTH_RETRIEVE_TOKEN';

  static USER_FETCH           = 'USER_FETCH';
  static USER_FETCH_SUCCESS   = 'USER_FETCH_SUCCESS';

  private tokenTimer = null;
  private url: string = null;

  isParamsFetching = false;

  constructor(
    private jwtHelper: JwtHelperService,
    private persistenceService: PersistenceService,
    private router: Router,
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private zone: NgZone,
  ) {
    if (!this.isRetrievedTokenValid()) {
      this.redirectToLogin();
    }
  }

  get currentUser$(): Observable<IUser> {
    return this.token$
      .map(token => token && this.jwtHelper.decodeToken(token))
      .map(tokenInfo => tokenInfo && { userId: tokenInfo.userId });
  }

  get userParams$(): Observable<IUserParams> {
    return combineLatest(
      this.currentUser$.map(user => user && user.userId),
      this.store.select(state => state.auth.params)
    )
    .pipe(
      tap(([ userId, params ]) => {
        if (params) {
          this.isParamsFetching = false;
        } else if (!this.isParamsFetching && userId) {
          this.refreshUserParamsAction();
        }
      }),
      map(([ user, params ]) => params),
      distinctUntilChanged(),
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.token$
      .map(token => this.isTokenValid(token) || this.isRetrievedTokenValid());
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

  redirectToLogin(url: string = null): void {
    this.url = url || this.router.url;
    this.router.navigate([AuthService.URL_LOGIN]);
  }

  redirectAfterLogin(): void {
    this.router.navigate([this.url || AuthService.URL_DEFAULT]);
    this.url = null;
  }

  saveToken(token: string): void {
    this.persistenceService.set(AuthService.TOKEN_NAME, token);
  }

  removeToken(): void {
    this.persistenceService.remove(AuthService.TOKEN_NAME);
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
    const token = this.persistenceService.get(AuthService.TOKEN_NAME);
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

  private get token$(): Observable<string> {
    return this.store.select(state => state.auth.token);
  }
}
