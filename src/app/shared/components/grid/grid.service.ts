import { Injectable } from '@angular/core';
import { RequestMethod } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/auth/auth.service';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';

@Injectable()
export class GridService {
  // defines whether the request should fetch a resource from the server's root
  private _localRequest = false;

  constructor(
    private http: AuthHttp,
    private authService: AuthService,
    private translateService: TranslateService) { }

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

  setRenderers(columns: IGridColumn[], renderers: object): IGridColumn[] {
    return columns.map((column: IGridColumn) => {
      const renderer = renderers[column.prop];
      return renderer ? this.setRenderer(column, renderer) : column;
    });
  }

  private setRenderer(
      column: IGridColumn,
      rendererFn: Function | IRenderer
  ): IGridColumn {

    const isArray = Array.isArray(rendererFn);
    const entities: ILabeledValue[] = isArray ? [].concat(rendererFn) : [];

    column.$$valueGetter = (entity: any, fieldName: string) => {
      const value: any = Reflect.get(entity, fieldName);

      if (isArray) {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.prop]);
        return labeledValue
          ? (column.localized ? this.translateService.instant(labeledValue.label) : labeledValue.label)
          : entity[column.prop];
      } else {

        const displayedValue = String((rendererFn as Function)(entity, value));
        return column.localized
          ? this.translateService.instant(displayedValue)
          : displayedValue;
      }
    };
    return column;
  }

  private request(url: string, method: RequestMethod, routeParams: object, body: object = null): Observable<any> {
    return this.validateUrl(url)
      .flatMap(rootUrl => {
        const route = this.createRoute(url, routeParams);
        const prefix = '/api';
        const api = route.startsWith(prefix) ? route : prefix + route;

        return this.http.request(`${rootUrl}${api}`, {
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
