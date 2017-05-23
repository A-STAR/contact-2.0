import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../core/auth/auth.service';

@Injectable()
export class GridService {
  // defines whether the request should fetch a resource from the server's root
  private _localRequest = false;

  constructor(private http: AuthHttp, private authService: AuthService) { }

  localRequest(): GridService {
    this._localRequest = true;
    return this;
  }

  read(url: string, routeParams: object = {}): Observable<any> {
    if (this._localRequest) {
      // this would not be a default value, so clear the flag for further requests
      this._localRequest = false;
      return this.http.get(url)
        .map(data => data.json());
    }

    return this.request(url, RequestMethod.Get, routeParams);
  }

  /**
   * NOTE: route params have to be enclosed in curly braces
   * Example:
   *  url = '/api/roles/{id}/permits', params = { id: 5 }
   *  route = '/api/roles/5/permits
   */
  create(url: string, routeParams: object = {}, body: object): Observable<any> {
    return this.request(url, RequestMethod.Post, routeParams, body);
  }

  update(url: string, routeParams: object = {}, body: object): Observable<any> {
    return this.request(url, RequestMethod.Put, routeParams, body);
  }

  delete(url: string, routeParams: object = {}): Observable<any> {
    return this.request(url, RequestMethod.Delete, routeParams);
  }

  private request(url: string, method: RequestMethod, routeParams: object, body: object = null): Observable<any> {
    return this.validateUrl(url)
      .flatMap(rootUrl => {
        const route = this.createRoute(url, routeParams);
        return this.http.request(`${rootUrl}${route}`, {
          method: method,
          body: body
        })
        .map(data => data.json());
      });
  }

  private validateUrl(url: string = ''): Observable<any> {
    if (!url) {
      return Observable.throw('Error: no url passed to the GridService');
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
