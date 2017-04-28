import { Injectable, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

const TOKEN_NAME = 'auth/token';

export const getToken = () => localStorage.getItem(TOKEN_NAME);

const setToken = (token: string) => localStorage.setItem(TOKEN_NAME, token);

const removeToken = () => localStorage.removeItem(TOKEN_NAME);

@Injectable()
export class AuthService implements CanActivate, OnInit {

  private authenticated = false;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  // backend root url
  private rootUrl = '';

  constructor(private http: AuthHttp, private router: Router) { }

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

  checkLogin(url: string): boolean {
    if (this.isAuthenticated) { return true; }

    const token = getToken();
    if (token) {
      // TODO: check this token for expiration with angular-jwt
      return this.authenticated = true;
    }

    // Store the attempted URL for redirecting
    this.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

  authenticate(login: string, password: string): Promise<boolean> {
    const body = JSON.stringify({ login, password });

    return this.http.post(`${this.rootUrl}/auth/login`, body)
      .toPromise()
      .then((resp: Response) => {
        setToken(resp.headers.get('X-Auth-Token'));
        return this.authenticated = true;
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
        return this.authenticated = true;  // FIXME
      });
  }

  logout(): Promise<boolean> {
    return this.http.get(`${this.rootUrl}/auth/logout`)
      .toPromise()
      .then((response: Response) => {
        removeToken();
        this.router.navigate(['/login']);
        return this.authenticated = false;
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
        return this.authenticated = false;  // FIXME
      });
  }
}
