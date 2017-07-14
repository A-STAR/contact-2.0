import { Injectable, NgZone } from '@angular/core';
import { Response } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { IAppState } from '../state/state.interface';

import { DataService } from '../data/data.service';

import { AppError } from '../error/app-error';

const TOKEN_NAME = 'auth/token';
const LANGUAGE_TOKEN = 'user/language';

export const getToken = () => localStorage.getItem(TOKEN_NAME);

const setToken = (token: string) => localStorage.setItem(TOKEN_NAME, token);

const removeToken = () => localStorage.removeItem(TOKEN_NAME);

@Injectable()
export class AuthService implements CanActivate {
  static GLOBAL_RESET = 'GLOBAL_RESET';

  static JWT_EXPIRATION_THRESHOLD = 60e3;
  static JWT_TIMER_INTERVAL = 10e3;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  private authenticated = false;
  private tokenTimer = null;

  constructor(
    private dataService: DataService,
    private router: Router,
    private jwtHelper: JwtHelper,
    private store: Store<IAppState>,
    private translateService: TranslateService,
    private zone: NgZone,
  ) {
    const token = getToken();
    if (this.isTokenValid(token)) {
      this.initTokenTimer(token);
    }
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    if (this.checkLogin(url)) {
      return true;
    }

    this.redirectToLogin(url);
    return false;
  }

  authenticate(login: string, password: string): Observable<boolean> {
    return this.dataService.post('/auth/login', {}, { login, password })
      .map((resp: Response) => resp.headers.get('X-Auth-Token'))
      .do((token: string) => {
        this.saveToken(token);
        this.setLanguage(token);
        this.authenticated = true;
      })
      .catch(error => {
        // this.authenticated = false;
        this.dispatchResetAction();
        throw error;
        // const { message } = error.json();
        // throw new Error(this.getErrorMessage(message));
      })
      .map(resp => true);
  }

  logout(): Observable<boolean> {
    return this.dataService.get('/auth/logout', {})
      .do(() => this.logoutHandler())
      .map(resp => true)
      .catch(error => {
        this.logoutHandler();
        return Observable.of(false);
      });
  }

  private logoutHandler(): void {
    removeToken();
    this.authenticated = false;
    this.redirectToLogin();
    this.dispatchResetAction();
  }

  redirectToLogin(url: string = null): void {
    this.clearTokenTimer();
    this.redirectUrl = url || this.router.url || '/home';
    this.router.navigate(['/login']);
  }

  private dispatchResetAction(): void {
    this.store.dispatch({ type: AuthService.GLOBAL_RESET });
  }

  // private getErrorMessage(message: any = null): string {
  //   switch (message.code) {
  //     case 'login.invalidCredentials':
  //       return 'validation.login.INVALID_CREDENTIALS';
  //     default:
  //       return 'validation.DEFAULT_ERROR_MESSAGE';
  //   }
  // }

  private isTokenValid(token: string): boolean {
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  private checkLogin(url: string): boolean {
    if (this.isAuthenticated) {
      return true;
    }

    const token = getToken();
    if (this.isTokenValid(token)) {
      return this.authenticated = true;
    }

    this.dispatchResetAction();
    return this.authenticated = false;
  }

  private refreshToken(): void {
    this.dataService.get('/api/refresh', {}, {})
      .map((resp: Response) => resp.headers.get('X-Auth-Token'))
      .subscribe(
        token => {
          this.saveToken(token);
          this.setLanguage(token);
        },
        () => this.redirectToLogin()
      );
  }

  private saveToken(token: string): void {
    this.initTokenTimer(token);
    setToken(token);
  }

  private initTokenTimer(token: string): void {
    this.zone.runOutsideAngular(() => {
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);

      this.clearTokenTimer();
      this.tokenTimer = setInterval(() => {
        const timeUntilExpiration = expirationDate.getTime() - Date.now();
        if (timeUntilExpiration < AuthService.JWT_EXPIRATION_THRESHOLD) {
          this.zone.run(() => {
            if (this.isTokenValid(token)) {
              this.refreshToken();
            } else {
              this.redirectToLogin();
            }
          });
        }
      }, AuthService.JWT_TIMER_INTERVAL);
    });
  }

  private clearTokenTimer(): void {
    if (this.tokenTimer) {
      clearInterval(this.tokenTimer);
    }
  }

  private setLanguage(token: string): void {
    const { language } = this.jwtHelper.decodeToken(token);
    this.translateService.setDefaultLang(language || 'en');
    this.translateService.use(language).subscribe();
    localStorage.setItem(LANGUAGE_TOKEN, language);
  }
}
