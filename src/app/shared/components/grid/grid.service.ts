import { Injectable } from '@angular/core';
import { RequestMethod, ResponseContentType, RequestOptionsArgs, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

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
    private authService: AuthService,
    private converterService: ValueConverterService,
    private dictionariesService: DictionariesService,
    private http: AuthHttp,
    private metadataService: MetadataService,
    private translateService: TranslateService,
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

  createBlob(url: string, routeParams: object = {}, body: object): Observable<Blob> {
    return this.blobRequest(url, routeParams, { method: RequestMethod.Post, body });
  }

  update(url: string, routeParams: object = {}, body: object, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Put, body });
  }

  delete(url: string, routeParams: object = {}, options: RequestOptionsArgs = {}): Observable<any> {
    return this.jsonRequest(url, routeParams, { ...options, method: RequestMethod.Delete } );
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
        a.remove();
        URL.revokeObjectURL(url);
      });
  }

  /**
   * Builds column defs from server metadata
   *
   * @param {string} metadataKey The key used to retreive coldefs the from the metadata service
   * @param {Observable<IGridColumn[]>} columns Initial column descriptions
   * @param {object} renderers Colums rendered, esentially getters
   * @returns {Observable<IGridColumn[]>} Column defininitions
   */
  getColumnDefs(
    metadataKey: string, columns: IGridColumn[], renderers: object): Observable<IGridColumn[]> {
      const mapColumns = ([metadata, dictionaries]) =>
        this.setRenderers(columns.filter(column =>
          !!metadata.find(metadataColumn => {
            const result = column.prop === metadataColumn.name || (column.mappedFrom || []).includes(metadataColumn.name);
            if (result) {
              if (!column.renderer) {
                const currentDictTypes = dictionaries[metadataColumn.dictCode];
                if (Array.isArray(currentDictTypes) && currentDictTypes.length) {
                  column.renderer = (item: ITypeCodeItem) => {
                    const typeDescription = currentDictTypes.find(
                      dictionaryItem => dictionaryItem.code === item.typeCode
                    );
                    return typeDescription ? typeDescription.name : item.typeCode;
                  };
                } else {
                  // Data types
                  switch (metadataColumn.dataType) {
                    case 2:
                      // Date
                      column.renderer = (item: any) => this.converterService.formatDateAsString(item[column.prop]);
                      break;
                    case 7:
                      // Date time
                      column.renderer = (item: any) => this.converterService.formatDateAsString(item[column.prop], true);
                      break;
                  }
                }
              }
              // Filters
              if (!!column.filterOptionsDictionaryId) {
                const dictTypes = dictionaries[column.filterOptionsDictionaryId];
                if (Array.isArray(dictTypes)) {
                  column.filterValues = R.reduce((acc, item) => {
                    acc[item.code] = item.name;
                    return acc;
                  }, {}, dictTypes);
                }
              }
            }
            return result;
          })
        ), renderers);

      return Observable.combineLatest(
        this.metadataService.metadata.map(metadata => metadata[metadataKey]),
        this.dictionariesService.dictionariesByCode
      ).map(mapColumns);
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
