import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';

const TOKEN_NAME = 'auth/token';

export const getToken = () => localStorage.getItem(TOKEN_NAME);

const setToken = (token: string) => localStorage.setItem(TOKEN_NAME, token);

const removeToken = () => localStorage.removeItem(TOKEN_NAME);

@Injectable()
export class AuthService implements CanActivate {

  private authenticated = false;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  private authorities: Array<string> = [];

  constructor(private http: AuthHttp, private router: Router) { }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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

    return this.http.post('http://localhost:8080/auth/login', body)
      .toPromise()
      .then((resp: Response) => {
        setToken(resp.headers.get('X-Auth-Token'));
        this.authorities = resp.json().authorities;
        return this.authenticated = true;
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
        return this.authenticated = true;  // FIXME
      });
  }

  logout(): Promise<boolean> {
    return this.http.get('http://localhost:8080/auth/logout')
      .toPromise()
      .then((response: Response) => {
        removeToken();
        this.authorities = [];
        this.router.navigate(['/login']);
        return this.authenticated = false;
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
        return this.authenticated = false;  // FIXME
      });
  }
}
