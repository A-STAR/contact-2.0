import { Injectable } from '@angular/core';
import { RequestMethod, ResponseContentType, RequestOptionsArgs, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/finally';

@Injectable()
export class DataService {
  // defines whether the request should fetch a resource from the server's root
  private _localRequest = false;

  private nRequests$ = new BehaviorSubject<number>(0);

  private rootUrl$: Observable<string>;

  constructor(private http: AuthHttp) {
    this.rootUrl$ = this.localRequest()
      .read('./assets/server/root.json')
      .publishReplay(1)
      .refCount()
      .map(response => response.url);
  }

  get isLoading$(): Observable<boolean> {
    return this.nRequests$
      .map(n => n > 0)
      .distinctUntilChanged();
  }

  localRequest(): DataService {
    this._localRequest = true;
    return this;
  }

  /**
   * NOTE: route params have to be enclosed in curly braces
   * Example:
   *  url = '/api/roles/{id}/permits', params = { id: 5 }
   *  route = '/api/roles/5/permits
   */
  read(url: string, routeParams: object = {}, options: RequestOptionsArgs = {}): Observable<any> {
    if (this._localRequest) {
      // this would not be a default value, so clear the flag for further requests
      this._localRequest = false;
      return this.http.get(url, options)
        .map(data => data.json());
    }

    return this.jsonRequest(url, routeParams, { method: RequestMethod.Get });
  }

  readBlob(url: string, routeParams: object = {}): Observable<Blob> {
    return this.blobRequest(url, routeParams, { method: RequestMethod.Get });
  }

  create(url: string, routeParams: object = {}, body: object, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Post, body });
  }

  createBlob(url: string, routeParams: object = {}, body: object): Observable<Blob> {
    return this.blobRequest(url, routeParams, { method: RequestMethod.Post, body });
  }

  update(url: string, routeParams: object = {}, body: object, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Put, body });
  }

  delete(url: string, routeParams: object = {}, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Delete } );
  }

  post(url: string, routeParams: object = {}, body: object, options: RequestOptionsArgs = {}): Observable<any> {
    return this.request(url, routeParams, { ...options, method: RequestMethod.Post, body }, null);
  }

  download(url: string, routeParams: object = {}, body: object, name: string): Observable<void> {
    return this.createBlob(url, routeParams, body)
      .map(blob => {
        // TODO(d.maltsev): maybe use a separate component with Renderer2 injected?
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
        URL.revokeObjectURL(url);
      });
  }

  // Request that expects JSON for *response*.
  // Request content type can be application/json, multipart/form-data, etc.
  private jsonRequest(url: string, routeParams: object, options: RequestOptionsArgs): Observable<any> {
    return this.request(url, routeParams, options)
      .map(data => data.json());
  }

  // Request that expects binary data for *response*.
  // Request content type can be application/json, multipart/form-data, etc.
  private blobRequest(url: string, routeParams: object, options: RequestOptionsArgs): Observable<Blob> {
    return this.request(url, routeParams, { ...options, responseType: ResponseContentType.Blob })
      .map(response => new Blob([ response.blob() ], { type: response.headers.get('content-type') }));
  }

  private request(url: string, routeParams: object, options: RequestOptionsArgs, prefix: string = '/api'): Observable<any> {
    const headers = options.headers || new Headers();
    if (options.body && options.body.constructor === Object) {
      headers.append('Content-Type', 'application/json');
    }

    this.nRequests$.next(this.nRequests$.value + 1);

    return this.validateUrl(url)
      .flatMap(rootUrl => {
        const route = this.createRoute(url, routeParams);
        const api = prefix && !route.startsWith(prefix) ? prefix + route : route;

        return this.http.request(`${rootUrl}${api}`, { ...options, headers });
      })
      .finally(() => {
        this.nRequests$.next(this.nRequests$.value - 1);
      });
  }

  private validateUrl(url: string = ''): Observable<any> {
    if (!url) {
      return Observable.throw('Error: no url passed to the GridService');
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
