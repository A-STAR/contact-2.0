import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { IAppState } from '../state/state.interface';

@Injectable()
export class AuthService implements CanActivate {
  static TOKEN_NAME = 'auth/token';
  static LANGUAGE_TOKEN = 'auth/language';

  static URL_DEFAULT = '/';
  static URL_LOGIN   = '/login';

  static JWT_EXPIRATION_THRESHOLD = 60e3;
  static JWT_TIMER_INTERVAL       = 10e3;

  static AUTH_LOGIN           = 'AUTH_LOGIN';
  static AUTH_REFRESH         = 'AUTH_REFRESH';
  static AUTH_LOGOUT          = 'AUTH_LOGOUT';
  static AUTH_CREATE_SESSION  = 'AUTH_CREATE_SESSION';
  static AUTH_DESTROY_SESSION = 'AUTH_DESTROY_SESSION';
  static AUTH_GLOBAL_RESET    = 'AUTH_GLOBAL_RESET';

  private tokenTimer = null;
  private url: string = null;

  constructor(
    private jwtHelper: JwtHelper,
    private router: Router,
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private zone: NgZone,
  ) {
    this.token$
      .do(token => {
        if (this.isTokenValid(token)) {
          this.initTokenTimer(token);
        }
      })
      .subscribe();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.token$
      .map(token => this.isTokenValid(token))
      .do(isTokenValid => {
        if (!isTokenValid) {
          this.dispatchResetAction();
        }
      });
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

  dispatchResetAction(): void {
    const action = this.createAction(AuthService.AUTH_DESTROY_SESSION);
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
    localStorage.setItem(AuthService.TOKEN_NAME, token);
  }

  removeToken(): void {
    localStorage.removeItem(AuthService.TOKEN_NAME);
  }

  saveLanguage(token: string): void {
    const { language } = this.jwtHelper.decodeToken(token);
    this.translateService.setDefaultLang(language || 'en');
    this.translateService.use(language).subscribe();
    localStorage.setItem(AuthService.LANGUAGE_TOKEN, language);
  }

  initTokenTimer(token: string): void {
    this.zone.runOutsideAngular(() => {
      this.tokenTimer = setInterval(() => this.onTimer(token), AuthService.JWT_TIMER_INTERVAL);
    });
  }

  clearTokenTimer(): void {
    if (this.tokenTimer) {
      clearInterval(this.tokenTimer);
    }
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

  private createAction(type: string, payload: object = {}): Action {
    return { type, payload };
  }

  private isTokenValid(token: string): boolean {
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  private get token$(): Observable<string> {
    return this.store
      .select(state => state.auth)
      .map(state => state.token)
      .distinctUntilChanged();
  }
}
