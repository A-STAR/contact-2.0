import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';
import { IAGridColumn, IGrid2Request, IGrid2RequestParams } from '../../../shared/components/grid2/grid2.interface';
import { ITypeCodeItem } from '../../../core/dictionaries/dictionaries.interface';

import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';

@Injectable()
export class GridService {
  constructor(
    private converterService: ValueConverterService,
    private dictionariesService: DictionariesService,
    private metadataService: MetadataService,
    private translateService: TranslateService,
  ) {}

  /**
   * Builds request parameters necessary to talk to the BE
   *
   * @param {IGrid2RequestParams} params
   * @param {FilterObject} filters
   * @returns {IGrid2Request}
   */
  buildRequest(params: IGrid2RequestParams, filters?: FilterObject): IGrid2Request {
    const request: IGrid2Request = {};
    const filter: FilterObject = FilterObject.create().and();
    const { sorters, currentPage, pageSize } = params;

    if (sorters) {
      request.sorting = sorters;
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
  getColumnDefs(metadataKey: string, columns: IAGridColumn[], renderers: object): Observable<IAGridColumn[]> {
    const mapColumns = ([metadata, dictionaries]) =>
      this.setValueGetters(columns.filter(column =>
        !!metadata.find(metadataColumn => {
          const isInMeta = column.colId === metadataColumn.name;
          if (isInMeta) {
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

    return Observable.combineLatest(
      this.metadataService.metadata.map(metadata => metadata ? metadata[metadataKey] : []),
      this.dictionariesService.dictionariesByCode,
    )
    .map(mapColumns);
  }

  setRenderers(columns: IGridColumn[], renderers: object): IGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.prop];
      return renderer ? this.setRenderer(column, renderer) : column;
    });
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

  // NOTE: ag-grid only
  setValueGetters(columns: IAGridColumn[], renderers: object): IAGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.colId];
      return renderer ? this.setValueGetter(column, renderer) : column;
    });
  }

  private setValueGetter(column: IAGridColumn, getterFn: Function | IRenderer): IAGridColumn {
    const isArray = Array.isArray(getterFn);
    const entities: ILabeledValue[] = isArray ? [].concat(getterFn) : [];

    column.renderer = (entity: any, fieldName: string) => {
      const value: any = Reflect.get(entity, fieldName);

      if (isArray) {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.colId]);
        return labeledValue
          ? (column.localized ? this.translateService.instant(labeledValue.label) : labeledValue.label)
          : entity[column.colId];

      } else {

        const displayValue = String((getterFn as Function)(entity, value));
        return column.localized
          ? this.translateService.instant(displayValue)
          : displayValue;
      }
    };
    return column;
  }
}
