import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CanActivate } from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

  authenticated = false;

  constructor(private http: Http) { }

  authenticate(login: string, password: string) {
    this.http.get('/api/1.0/auth/login')
      .toPromise()
      .then(resp => {
        const auth = resp.json();
        console.log(auth);
        this.authenticated = true;
      })
      .catch(error => {
        this.authenticated = false;
        console.log(error);
      });
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {
    console.log('AuthGuard#canActivate called');
    return true;
  }
}
