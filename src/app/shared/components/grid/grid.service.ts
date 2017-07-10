import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/finally';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';
import {
  IGrid2ColumnSettings,
  IGrid2Request,
  IGrid2RequestPayload,
} from '../../../shared/components/grid2/grid2.interface';
import { ITypeCodeItem } from '../../../core/dictionaries/dictionaries.interface';

import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

import { FilterObject, IFilterBaseObject } from '../../../shared/components/grid2/filter/grid2-filter';

@Injectable()
export class GridService {
  constructor(
    private converterService: ValueConverterService,
    private dictionariesService: DictionariesService,
    private metadataService: MetadataService,
    private translateService: TranslateService,
  ) {}

  buildRequest(payload: IGrid2RequestPayload): IGrid2Request {
    const request: IGrid2Request = {};
    const filters: FilterObject = FilterObject.create().and();
    if (payload.columnsSettings) {
      R.values(payload.columnsSettings)
        .forEach(columnSettings => {
          const { filter } = columnSettings;
          if (filter) {
            filter.addFilter(
              FilterObject.create(filter)
            );
          }
        });

      if (payload.gridFilters) {
        payload.gridFilters.forEach((filter: IFilterBaseObject) => {
          filters.addFilter(
            FilterObject.create(filter)
          );
        });
      }

      request.filtering = filters;

      request.sorting = R.values(R.mapObjIndexed(
        (columnSettings: IGrid2ColumnSettings, columnId: string) => ({
          direction: columnSettings.sortDirection,
          field: columnId,
          order: columnSettings.sortOrder,
        }),
        payload.columnsSettings
      ))
      .filter(Boolean)
      .sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      .map(R.omit(['order']));
    }

    if (!R.isNil(payload.currentPage) && !R.isNil(payload.pageSize)) {
      request.paging = {
        pageNumber: payload.currentPage,
        resultsPerPage: payload.pageSize
      };
    }
    return request;
  }

  /**
   * Build column defs from server metadata
   * Use only once, preferably during ngOnInit phase
   *
   * @param {string} metadataKey The key used to retrieve coldefs the from the metadata service
   * @param {Observable<IGridColumn[]>} columns Initial column descriptions
   * @param {object} renderers Column renderers, esentially getters
   * @returns {Observable<IGridColumn[]>} Column defininitions
   */
  getColumnDefs(
    metadataKey: string, columns: IGridColumn[], renderers: object): Observable<IGridColumn[]> {
      const mapColumns = ([metadata, dictionaries]) =>
        this.setRenderers(columns.filter(column =>
          !!metadata.find(metadataColumn => {
            const isInMeta = column.prop === metadataColumn.name;
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
                      column.renderer = (item: any) => this.converterService.isoToLocalDate(item[column.prop]);
                      break;
                    case 7:
                      // Datetime
                      column.renderer = (item: any) => this.converterService.isoToLocalDateTime(item[column.prop]);
                      break;
                  }
                }
              }
              // Filters
              if (!!column.filterOptionsDictionaryId) {
                const dictTypes = dictionaries[column.filterOptionsDictionaryId];
                if (Array.isArray(dictTypes)) {
                  column.filterValues = dictTypes.reduce((acc, item) => {
                    acc[item.code] = item.name;
                    return acc;
                  }, {});
                }
              }
            }
            return isInMeta;
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
}
