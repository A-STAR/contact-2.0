import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../../../core/auth/auth.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GridService {
  // defines whether the request should fetch a resource from the server's root
  private _localRequest = false;

  constructor(private http: AuthHttp, private authService: AuthService) { }

  localRequest(): GridService {
    this._localRequest = true;
    return this;
  }

  read(url: string, routeParams: object = {}): Promise<any> {
    if (this._localRequest) {
      // this would not be a default value, so clear the flag for further requests
      this._localRequest = false;
      return this.http.get(url)
        .toPromise()
        .then(data => data.json());
    }

    return this.request(url, RequestMethod.Get, routeParams);
  }

  /**
   * NOTE: route params have to be enclosed in curly braces
   * Example:
   *  url = '/api/roles/{id}/permits', params = { id: 5 }
   *  route = '/api/roles/5/permits
   */
  create(url: string, routeParams: object = {}, body: object): Promise<any> {
    return this.request(url, RequestMethod.Post, routeParams, body);
  }

  update(url: string, routeParams: object = {}, body: object): Promise<any> {
    return this.request(url, RequestMethod.Put, routeParams, body);
  }

  delete(url: string, routeParams: object = {}, bodyParams: object = {}): Promise<any> {
    return this.request(url, RequestMethod.Delete, routeParams, bodyParams);
  }

  private request(url: string, method: RequestMethod, routeParams: object = {}, body: object = {}): Promise<any> {
    return this.validateUrl(url)
      .then(rootUrl => {
        const route = this.createRoute(url, routeParams);
        return this.http.request(`${rootUrl}${route}`, {
          method: method,
          body: body
        }).toPromise()
          .then(data => data.json());
      });
  }

  private validateUrl(url: string = ''): Promise<any> {
    if (!url) {
      return Promise.reject('Error: no url passed to the GridService');
    }
    return this.authService.getRootUrl();
  }

  private createRoute(url: string, params: object): string {
    return Object.keys(params).reduce((acc, id) => {
      const re = RegExp(`{${id}}`, 'gi');
      return acc.replace(re, params[id]);
    }, url);
  }
}
