import { Inject, Injectable, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

const TOKEN_NAME = 'auth/token';

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

  constructor(private http: AuthHttp, private router: Router, private jwtHelper: JwtHelper) {
    const token = getToken();
    if (this.isTokenValid(token)) {
      this.initTokenTimer(token);
    }
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  ngOnInit() {
    this.getRootUrl();
  }

  getRootUrl(): Promise<string> {
    if (this.rootUrl) {
      return Promise.resolve(this.rootUrl);
    }

    return this.http.get('./assets/server/root.json')
      .toPromise()
      .then(resp => {
        this.rootUrl = resp.json().url;
        return this.rootUrl;
      })
      .catch(err => console.error(err));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  authenticate(login: string, password: string): Promise<boolean> {
    const body = JSON.stringify({ login, password });

    return this.getRootUrl()
      .then(root => {
        return this.http.post(`${root}/auth/login`, body)
          .toPromise()
          .then((resp: Response) => {
            this.saveToken(resp);
            return this.authenticated = true;
          });
      })
      .catch(error => {
        this.authenticated = false;
        const { message } = error.json();
        throw new Error(message);
      })
      .catch(error => {
        throw new Error(this.getErrorMessage(error.message));
      });
  }

  logout(): Promise<boolean> {
    return this.getRootUrl()
      .then(root => {
        return this.http.get(`${root}/auth/logout`)
        .toPromise()
        .then((response: Response) => {
          removeToken();
          this.redirectToLogin();
          return this.authenticated = false;
        });
      })
      .catch(error => {
        console.error(error.statusText || error.status || 'Request error');
        return this.authenticated = false;  // FIXME
      });
  }

  private getErrorMessage(message = null) {
    switch (message) {
      case 'login.invalidCredentials':
        return 'validation.login.INVALID_CREDENTIALS';
      default:
        return 'validation.DEFAULT_ERROR_MESSAGE';
    }
  }

  private isTokenValid(token: string) {
    return token && !this.jwtHelper.isTokenExpired(token);
  }

  private redirectToLogin(url = null) {
    this.clearTokenTimer();
    this.redirectUrl = url || this.router.url || '/home';
    this.router.navigate(['/login']);
  }

  private checkLogin(url: string): boolean {
    if (this.isAuthenticated) {
      return true;
    }

    const token = getToken();
    if (this.isTokenValid(token)) {
      return this.authenticated = true;
    }

    this.redirectToLogin(url);
    return false;
  }

  private refreshToken() {
    return this.getRootUrl()
      .then(root => {
        return this.http.post(`${root}/auth/login`, {
          // FIXME!!!
          login: 'spring',
          password: 'spring'
        })
          .toPromise()
          .then((resp: Response) => {
            this.saveToken(resp);
          });
      })
      .catch(() => this.redirectToLogin());
  }

  private saveToken(response: Response) {
    const token = response.headers.get('X-Auth-Token');
    this.initTokenTimer(token);
    setToken(token);
  }

  private initTokenTimer(token: string) {
    const expirationDate = this.jwtHelper.getTokenExpirationDate(token);

    this.clearTokenTimer();
    this.tokenTimer = setInterval(() => {
      const timeUntilExpiration = expirationDate.getTime() - Date.now();
      if (timeUntilExpiration < AuthService.JWT_EXPIRATION_THRESHOLD) {
        this.refreshToken();
      }
    }, AuthService.JWT_TIMER_INTERVAL);
  }

  private clearTokenTimer() {
    if (this.tokenTimer) {
      clearInterval(this.tokenTimer);
    }
  };
}
