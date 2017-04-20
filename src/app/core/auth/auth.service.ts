import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService implements CanActivate {

  private authenticated = false;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({ headers: this.headers });
  private authorities: Array<string> = [];
  private tokenName = 'auth/token';

  constructor(private http: Http, private router: Router) { }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.isAuthenticated) { return true; }

    const token = window.localStorage.getItem(this.tokenName);
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
    const body = JSON.stringify({ username: login, password });

    return this.http.post('http://localhost:8080/auth/login', body, this.options)
      .toPromise()
      .then((resp: Response) => {
        const token = resp.headers.get('X-Auth-Token');
        window.localStorage.setItem(this.tokenName, token);
        this.authorities = resp.json().authorities;
        return this.authenticated = true;
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
        return this.authenticated = true;
      });
  }

  logout(): void {
    window.localStorage.removeItem(this.tokenName);
    this.authenticated = false;
    this.router.navigate(['/login']);
  }

}
