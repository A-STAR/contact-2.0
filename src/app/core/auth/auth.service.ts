import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService implements CanActivate {

  private authenticated = false;

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  private headers = new Headers({'Content-Type': 'application/json'});

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

  authenticate(login: string, password: string): Promise<boolean> {
    const body = JSON.stringify({ username: login, password });
    // return this.http.post('/api/auth/login', body, this.headers)
    return this.http.post('http://localhost:8080/auth/login', body, this.headers)
      .toPromise()
      .then(resp => {
        const auth = resp.json();
        console.log(auth);
        return this.authenticated = true;
      })
      .catch(error => {
        console.log(error.statusText || error.status || 'Request error');
        return this.authenticated = true;
      });
  }

  logout(): void {
    this.authenticated = false;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

}
