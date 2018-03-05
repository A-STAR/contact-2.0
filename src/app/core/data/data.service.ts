import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { publishReplay, refCount, finalize, catchError, flatMap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { IEntityTranslation } from '../entity/translations/entity-translations.interface';
import { IQueryParam, IQueryParams } from './data.interface';

import { AuthService } from '@app/core/auth/auth.service';

interface RequestOptions {
  body?: any;
  headers?: HttpHeaders;
  observe?: 'response' | 'body' | 'events';
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  // Params whose value is falsy will NOT be sent
  params?: IQueryParams;
}

@Injectable()
export class DataService {
  static METHOD_GET     = 'GET';
  static METHOD_POST    = 'POST';
  static METHOD_PUT     = 'PUT';
  static METHOD_DELETE  = 'DELETE';
  static METHOD_OPTIONS = 'OPTIONS';

  private nRequests$ = new BehaviorSubject<number>(0);
  private rootUrl$: Observable<string>;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.rootUrl$ = this
      .readLocal('./assets/server/root.json')
      .pipe(
        publishReplay(1),
        refCount()
      )
      .map(response => response.url);
  }

  get isLoading$(): Observable<boolean> {
    return this.nRequests$
      .map(n => n > 0)
      .distinctUntilChanged();
  }

  readLocal(url: string): Observable<any> {
    return this.http.get(url);
  }

  /**
   * NOTE: route params have to be enclosed in curly braces
   * Example:
   *  url = '/roles/{id}/permits', params = { id: 5 }
   *  route = '/roles/5/permits
   */
  read(url: string, routeParams: object = {}, options: RequestOptions = {}): Observable<any> {
    return this.jsonRequest(DataService.METHOD_GET, url, routeParams, { ...options })
      .map(response => response.data && response.data[0] || null);
  }

  readAll(url: string, routeParams: object = {}, options: RequestOptions = {}): Observable<any[]> {
    return this.jsonRequest(DataService.METHOD_GET, url, routeParams, { ...options })
      .map(response => response.data || []);
  }

  readBlob(url: string, routeParams: object = {}): Observable<Blob> {
    return this.blobRequest(DataService.METHOD_GET, url, routeParams);
  }

  readTranslations(entityId: string|number, entityAttributesId: number|string): Observable<IEntityTranslation[]> {
    return this.readAll('/entityAttributes/{entityAttributesId}/entities/{entitiesId}', {
        entityAttributesId: entityAttributesId,
        entitiesId: entityId
      });
  }

  create(url: string, routeParams: object = {}, body: object, options: RequestOptions = {}): Observable<any> {
    return this.jsonRequest(DataService.METHOD_POST, url, routeParams, { ...options, body });
  }

  createMultipart(url: string, params: object = {}, body: object, file: File, options: RequestOptions = {}): Observable<any> {
    const data = this.prepareMultipartFormData(body, file);
    return this.jsonRequest(DataService.METHOD_POST, url, params, { ...options, body: data });
  }

  createBlob(url: string, routeParams: object = {}, body: object): Observable<Blob> {
    return this.blobRequest(DataService.METHOD_POST, url, routeParams, { body });
  }

  update(url: string, routeParams: object = {}, body: object, options: RequestOptions = {}): Observable<any> {
    return this.jsonRequest(DataService.METHOD_PUT, url, routeParams, { ...options, body });
  }

  updateMultipart(url: string, params: object = {}, body: object, file: File, options: RequestOptions = {}): Observable<any> {
    const data = this.prepareMultipartFormData(body, file);
    return this.jsonRequest(DataService.METHOD_PUT, url, params, { ...options, body: data });
  }

  delete(url: string, routeParams: object = {}, options: RequestOptions = {}): Observable<any> {
    return this.jsonRequest(DataService.METHOD_DELETE, url, routeParams, { ...options } );
  }

  get(url: string, routeParams: object = {}, options: RequestOptions = {}): Observable<any> {
    return this.request(DataService.METHOD_GET, url, routeParams, { ...options }, null);
  }

  post(url: string, routeParams: object = {}, body: object, options: RequestOptions = {}): Observable<any> {
    return this.request(DataService.METHOD_POST, url, routeParams, { ...options, body }, null);
  }
  /**
   * Request that expects JSON for *response*.
   * Request content type is pre-set to `json`
   * @param method HTTP method
   * @param url Endpoint
   * @param routeParams Params like {id} etc.
   * @param options Other HTTP options, p.e. `body` etc.
   */
  private jsonRequest(method: string, url: string, routeParams: object, options: RequestOptions): Observable<any> {
    return this.request(method, url, routeParams, { ...options, responseType: 'json' });
  }
  /**
   * Request that expects binary data for *response*.
   * Request content type can be passed over in the header object, p.e. multipart/form-data, etc.
   * @param method HTTP method
   * @param url Endpoint
   * @param routeParams Params like {id} etc.
   * @param options Other HTTP options, like `body` etc.
   */
  private blobRequest(method: string, url: string, routeParams: object, options: RequestOptions = {}): Observable<Blob> {
    return this.request(method, url, routeParams, { ...options, responseType: 'blob', observe: 'response' })
      .map(response => new Blob([ response.body ], { type: response.headers.get('content-type') }));
  }

  private request(
    method: string,
    url: string,
    routeParams: object,
    options: RequestOptions,
    prefix: string = '/api'
  ): Observable<any> {
    const headers = options.headers || new HttpHeaders();
    if (options.body && options.body.constructor === Object) {
      headers.append('Content-Type', 'application/json');
    }

    const isAuthenticated = this.authService.isRetrievedTokenValid();
    if (!isAuthenticated && !['/auth/login', '/api/refresh'].includes(url)) {
      return empty();
    }

    // increase the request counter for the loader
    this.nRequests$.next(this.nRequests$.value + 1);

    return this.validateUrl(url)
      .pipe(
        flatMap(rootUrl => {
          const route = this.createRoute(url, routeParams);
          const api = prefix && !route.startsWith(prefix) ? prefix + route : route;

          return this.http.request(method, `${rootUrl}${api}`, {
            ...options,
            params: this.prepareHttpParams(options.params),
            headers
          });
        }),
        catchError(resp => {
          if (401 === resp.status) {
            // TODO(a.tymchuk): ask for the password again
            console.error('authentication error', resp);
          }
          // rethrow the error up the chain
          return ErrorObservable.create(resp);
        }),
        finalize(() => {
          this.nRequests$.next(this.nRequests$.value - 1);
        })
      );
  }

  private prepareHttpParams(params: IQueryParams = {}): HttpParams {
    return Object.keys(params).reduce((acc, key) => {
      return params[key] ? acc.set(key, this.toQueryParam(params[key])) : acc;
    }, new HttpParams());
  }

  private toQueryParam(value: IQueryParam | IQueryParam[]): string {
    return value === true ? '1' : `${value}`;
  }

  private prepareMultipartFormData(body: object, file: File): FormData {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (body) {
      const payload = file
        ? { ...body, fileName: file.name }
        : body;
      const properties = new Blob(
        [ JSON.stringify(payload) ],
        { type: 'application/json;charset=UTF-8' }
      );
      formData.append('properties', properties);
    }
    return formData;
  }

  private validateUrl(url: string = ''): Observable<string> {
    if (!url) {
      return ErrorObservable.create('Error: no url passed to the DataService');
    }
    return this.rootUrl$;
  }

  private createRoute(url: string, params: object): string {
    return Object.keys(params).reduce((acc, id) => {
      const re = RegExp(`{${id}}`, 'gi');
      return acc.replace(re, params[id]);
    }, url);
  }
}
