import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../core/auth/auth.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GridService {
  // defines wether the request should fetch a resource from the server's root
  private _localRequest = false;

  constructor(private http: AuthHttp, private authService: AuthService) { }

  localRequest(): GridService {
    this._localRequest = true;
    return this;
  }

  read(url: string): Promise<any> {
    if (this._localRequest) {
      // this whould not be a default value, so clear the flag for further requests
      this._localRequest = false;
      return this.http.get(url)
        .toPromise()
        .then(data => data.json());
    }

    return this.validateUrl(url)
      .then(rootUrl => {
        return this.http.get(`${rootUrl}${url}`)
          .toPromise()
          .then(data => data.json());
     });
  }

  // TODO: to be implemented
  create(url: string): Promise<any> {
    return Promise.resolve(false);
  }

  update(url: string, key: string | number, body: object): Promise<any> {
     return this.validateUrl(url)
      .then(rootUrl => {
        return this.http.put(`${rootUrl}${url}/${key}`, body)
          .toPromise()
          .then(data => data.json());
     });
  }

  // TODO: to be implemented
  delete(url: string): Promise<any> {
    return Promise.resolve(false);
  }

  private validateUrl(url: string = ''): Promise<any> {
    if (!url) {
      return Promise.reject('Error: no url passed to the GridService');
    }
    return this.authService.getRootUrl();
  }
}
