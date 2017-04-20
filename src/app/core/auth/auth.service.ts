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
  private headers = new Headers({'Content-Type': 'application/json', 'X-Auth-Token': ''});
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authenticated) { return true; }

    // Store the attempted URL for redirecting
    this.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

  authenticate(login: string, password: string): Observable<boolean> {
    const body = JSON.stringify({ username: login, password });
    // const options: RequestOptionsArgs = { headers: this.headers };
    return this.http.post('http://localhost:8080/auth/login', body, this.options)
      // .toPromise()
      .map((resp: Response) => {
        // const token = resp.headers();
        console.log('resp', resp);
        console.log('token 2', resp.headers.get('X-Auth-Token'));
        console.log('token 3', resp.headers.get('X-Xss-Protection'));
        // const auth = resp.json();
        return this.authenticated = true;
      });
      // .catch(error => {
      //   console.log(error.statusText || error.status || 'Request error');
      //   return this.authenticated = true;
      // });
  }

  logout(): void {
    this.authenticated = false;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

}
