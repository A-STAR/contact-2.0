import { Injectable, OnInit } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

const TOKEN_NAME = 'auth/token';
const LANGUAGE_TOKEN = 'user/language';

export const getToken = () => localStorage.getItem(TOKEN_NAME);

const setToken = (token: string) => localStorage.setItem(TOKEN_NAME, token);

const removeToken = () => localStorage.removeItem(TOKEN_NAME);

@Injectable()
export class AuthService implements CanActivate, OnInit {
  static JWT_EXPIRATION_THRESHOLD = 60e3;
  static JWT_TIMER_INTERVAL = 10e3;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  private authenticated = false;
  // backend root url
  private rootUrl = '';
  private tokenTimer = null;

  private defaultHeaders = new Headers({
    'Content-Type': 'application/json'
  });

  constructor(
    private http: AuthHttp,
    private router: Router,
    private jwtHelper: JwtHelper,
    private translateService: TranslateService,
  ) {
    const token = getToken();
    if (this.isTokenValid(token)) {
      this.initTokenTimer(token);
    }
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  ngOnInit(): void {
    this.getRootUrl();
  }

  getRootUrl(): Observable<string> {
    if (this.rootUrl) {
      return Observable.of(this.rootUrl);
    }

    return this.http.get('./assets/server/root.json', { headers: this.defaultHeaders })
      .map(resp => resp.json().url)
      .do(root => this.rootUrl = root)
      .catch(err => {
        console.error(err);
        throw err;
      });
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
    const body = JSON.stringify({ login, password });

    return this.getRootUrl()
      .flatMap((root: string) => {
        return this.http.post(`${root}/auth/login`, body, { headers: this.defaultHeaders })
          .map((resp: Response) => resp.headers.get('X-Auth-Token'))
          .do((token: string) => {
              this.saveToken(token);
              this.setLanguage(token);
              this.authenticated = true;
          })
          .catch(error => {
            this.authenticated = false;
            const { message } = error.json();
            throw new Error(this.getErrorMessage(message));
          })
          .map(resp => true);
      });
  }

  logout(): Observable<boolean> {
    return this.getRootUrl()
      .flatMap(root => {
        return this.http.get(`${root}/auth/logout`, { headers: this.defaultHeaders })
          .do(() => this.logoutHandler())
          .map(resp => true)
          .catch(error => {
            this.logoutHandler();
            return Observable.of(false);
          });
      });
  }

  private logoutHandler() {
    removeToken();
    this.authenticated = false;
    this.redirectToLogin();
  }

  redirectToLogin(url: string = null): void {
    this.clearTokenTimer();
    this.redirectUrl = url || this.router.url || '/home';
    this.router.navigate(['/login']);
  }

  private getErrorMessage(message: any = null): string {
    switch (message.code) {
      case 'login.invalidCredentials':
        return 'validation.login.INVALID_CREDENTIALS';
      default:
        return 'validation.DEFAULT_ERROR_MESSAGE';
    }
  }

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

    return this.authenticated = false;
  }

  private refreshToken(): void {
    this.getRootUrl()
      .flatMap(root => this.http.get(`${root}/api/refresh`, { headers: this.defaultHeaders }))
      .subscribe(
        resp => {
          const token = resp.headers.get('X-Auth-Token');
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
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);

    this.clearTokenTimer();
    this.tokenTimer = setInterval(() => {
      const timeUntilExpiration = expirationDate.getTime() - Date.now();
      if (timeUntilExpiration < AuthService.JWT_EXPIRATION_THRESHOLD) {
        this.refreshToken();
      }
    }, AuthService.JWT_TIMER_INTERVAL);
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
