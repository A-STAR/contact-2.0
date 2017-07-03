import { Injectable } from '@angular/core';
import { RequestMethod, ResponseContentType, RequestOptionsArgs, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { TranslateService } from '@ngx-translate/core';

import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';
import { ITypeCodeItem, IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';

import { AuthService } from '../../../core/auth/auth.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

@Injectable()
export class GridService {
  // defines whether the request should fetch a resource from the server's root
  private _localRequest = false;

  private nRequests$ = new BehaviorSubject<number>(0);

  constructor(
    private http: AuthHttp,
    private authService: AuthService,
    private translateService: TranslateService,
    private metadataService: MetadataService,
    private dictionariesService: DictionariesService,
    private converterService: ValueConverterService,
  ) {}

  get isLoading$(): Observable<boolean> {
    return this.nRequests$
      .map(n => n > 0)
      .distinctUntilChanged();
  }

  localRequest(): GridService {
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

  update(url: string, routeParams: object = {}, body: object, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Put, body });
  }

  delete(url: string, routeParams: object = {}, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Delete } );
  }

  configureColumnsUsingMetadataAndRenderers(
    metadataKey: string, gridColumns: Observable<IGridColumn[]>, renderers: object): Observable<IGridColumn[]> {
    return Observable.combineLatest(
      gridColumns,
      this.metadataService.metadata.map(metadata => metadata[metadataKey]),
      this.dictionariesService.dictionariesByCode
    ).map(([columns, metadata, dictionariesByCode]) =>
      this.setRenderers(columns.filter(column =>
        !!metadata.find((metadataColumn => {
          const result = column.prop === metadataColumn.name || ((column.mappedFrom || []).includes(metadataColumn.name));
          if (result && !column.renderer) {
            const currentDictTypes = dictionariesByCode[metadataColumn.dictCode];
            if (Array.isArray(currentDictTypes) && currentDictTypes.length) {
              column.renderer = (item: ITypeCodeItem) => {
                const typeDescription = currentDictTypes.find(
                  (dictionaryItem: IDictionaryItem) => dictionaryItem.code === item.typeCode
                );
                return typeDescription ? typeDescription.name : item.typeCode;
              };
            } else {
              // Data types
              switch (metadataColumn.dataType) {
                case 2:
                  // Date
                  column.renderer = (item: any) => this.converterService.stringToDate(item[column.prop]);
                  break;
                case 7:
                  // Date time
                  column.renderer = (item: any) => this.converterService.formatDate(item[column.prop], true);
                  break;
              }
            }
          }
          return result;
        }))
      ), renderers)
    );
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

        const displayValue = String((rendererFn as Function)(entity, value));
        return column.localized
          ? this.translateService.instant(displayValue)
          : displayValue;
      }
    };
    // NOTE: for compatibility between grid & grid2
    // TODO(a.tymchuk): see if @swimlane has a better option
    column.renderer = column.$$valueGetter;
    return column;
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

  private request(url: string, routeParams: object, options: RequestOptionsArgs): Observable<any> {
    const headers = options.headers || new Headers();
    if (options.body && options.body.constructor === Object) {
      headers.append('Content-Type', 'application/json');
    }

    this.nRequests$.next(this.nRequests$.getValue() + 1);

    return this.validateUrl(url)
      .flatMap(rootUrl => {
        const route = this.createRoute(url, routeParams);
        const prefix = '/api';
        const api = route.startsWith(prefix) ? route : prefix + route;

        return this.http.request(`${rootUrl}${api}`, { ...options, headers });
      })
      .finally(() => {
        this.nRequests$.next(this.nRequests$.getValue() - 1);
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
