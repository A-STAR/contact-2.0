import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';
import { IAGridColumn, IAGridRequest, IAGridRequestParams, IAGridSorter } from '../../../shared/components/grid2/grid2.interface';
import { ITypeCodeItem } from '../../../core/dictionaries/dictionaries.interface';

import { DataService } from '../../../core/data/data.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
// import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';

@Injectable()
export class GridService {
  constructor(
    private converterService: ValueConverterService,
    private dataService: DataService,
    private metadataService: MetadataService,
    private translateService: TranslateService,
    // private userDictionariesService: UserDictionariesService,
  ) {}

  /**
   * Builds request parameters necessary to talk to the BE
   *
   * @param {IAGridRequestParams} params
   * @param {FilterObject} filters
   * @returns {IAGridRequest}
   */
  buildRequest(params: IAGridRequestParams, filters?: FilterObject): IAGridRequest {
    const request: IAGridRequest = {};
    const filter: FilterObject = FilterObject.create().and();
    const { sorters, currentPage, pageSize } = params;

    if (sorters) {
      request.sorting = sorters.map(col => {
        return { field: col.colId, direction: col.sort } as IAGridSorter;
      });
    }

    if (filters) {
      filter.addFilter(filters);
    }

    if (filter.hasFilter() || filter.hasValues()) {
      request.filtering = filter;
    }

    if (!R.isNil(currentPage) && !R.isNil(pageSize)) {
      request.paging = {
        pageNumber: currentPage,
        resultsPerPage: pageSize
      };
    }

    return request;
  }

  /**
   * Builds column defs from server metadata
   * To be used only once during ngOnInit phase
   *
   * @param {string} metadataKey The key used to retrieve coldefs the from the metadata service
   * @param {Observable<IAGridColumn[]>} columns Initial column descriptions
   * @param {object} renderers Column renderers, i.e. getters
   * @returns {Observable<IAGridColumn[]>} Column defininitions
   */
  getColumnMeta(metadataKey: string, columns: IAGridColumn[], renderers: object): Observable<IAGridColumn[]> {
    const mapColumns = ([metadata, dictionaries]) => {

      // const dictionaryIds = columns.filter(column =>
      //   !!metadata.find(metaColumn => metaColumn.name === column.colId)
      // )
      // .map(column => Object.assign(column, { meta: metadata.find(metaColumn => metaColumn.name === column.colId) }))
      // .filter(column => column.filterDictionaryId && column.filterDictionaryId === column.meta.dictCode)
      // .map(column => column.filterDictionaryId);
      // console.log('dictionaries', dictionaries);

      const result = this.setValueGetters(columns.filter(column =>
        !!metadata.find(metaColumn => {
          const isInMeta = column.colId === metaColumn.name;
          if (isInMeta) {
            if (!column.renderer) {
              const dictionary = dictionaries[metaColumn.dictCode];
              if (Array.isArray(dictionary)) {
                column.renderer = (row: ITypeCodeItem) => {
                  const typeDescription = dictionary.find(item => item.code === row.typeCode);
                  return typeDescription ? typeDescription.name : row.typeCode;
                };
              } else {
                // Data types
                switch (metaColumn.dataType) {
                  case 2:
                    // Date
                    column.renderer = (item: any) => this.converterService.ISOToLocalDate(item[column.colId]);
                    break;
                  case 7:
                    // Datetime
                    column.renderer = (item: any) => this.converterService.ISOToLocalDateTime(item[column.colId]);
                    break;
                }
              }
            }
            // Dictionary filters
            if (column.filterDictionaryId) {
              const dictTypes = dictionaries[column.filterDictionaryId];
              if (Array.isArray(dictTypes)) {
                column.filterValues = dictTypes.map(item => ({ id: item.id, code: item.code, name: item.name }));
              }
            }
          }
          return isInMeta;
        })
      ), renderers);

      return result;
    };

    return Observable.combineLatest(
      this.metadataService.metadata.map(metadata => metadata ? metadata[metadataKey] : []),
      this.getAllDictionaries([4]),
    )
    .map(mapColumns);
  }

  // private getAllDictionaries(Ids: number[]): Observable<{ [index: number]: Array<any> }> {
  //   return Observable.combineLatest(
  //     this.userDictionariesService.getAllDictionaries(),
  //   ).map(([usersActionsTypes]) => {
  //     return { [UserDictionariesService.DICTIONARY_ACTION_TYPES]: usersActionsTypes };
  //   }).distinctUntilChanged();
  // }

  setRenderers(columns: IGridColumn[], renderers: object): IGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.prop];
      return renderer ? this.setRenderer(column, renderer) : column;
    });
  }

  // NOTE: ag-grid only
  setValueGetters(columns: IAGridColumn[], renderers: object): IAGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.colId];
      return renderer ? this.setValueGetter(column, renderer) : column;
    });
  }

  private getAllDictionaries(Ids: number[]): Observable<{ [index: number]: Array<any> }> {
    const Dictionaries = Observable
      .forkJoin(Ids.slice().map(id => this.dataService.read('/dictionaries/{id}/userterms', { id })
      .map(resp => resp.userTerms)));

      return Observable.zip(
        Dictionaries,
        Ids,
        (dictionaries, ids) => {
          return dictionaries.reduce((acc, dictionary) => {
            acc[ids] = dictionary;
            return acc;
          }, {});
        }
      );
  }

  private setRenderer(column: IGridColumn, rendererFn: Function | IRenderer): IGridColumn {
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

  private setValueGetter(column: IAGridColumn, getterFn: Function | IRenderer): IAGridColumn {
    const isArray = Array.isArray(getterFn);
    const entities: ILabeledValue[] = isArray ? [].concat(getterFn) : [];

    column.renderer = (entity: any, fieldName: string) => {
      const value: any = Reflect.get(entity, fieldName);

      if (isArray) {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.colId]);
        return labeledValue ? labeledValue.label : entity[column.colId];

      } else {
        return String((getterFn as Function)(entity, value));
      }
    };
    return column;
  }
}
