import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';
import { IAGridColumn, IAGridRequest, IAGridRequestParams, IAGridSorter } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataColumn } from '../../../core/metadata/metadata.interface';
import { ITypeCodeItem } from '../../../core/dictionaries/dictionaries.interface';
import { IUserDictionaries } from '../../../core/user/dictionaries/user-dictionaries.interface';

import { MetadataService } from '../../../core/metadata/metadata.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { renderers as gridRenderers } from '../../../core/utils/index';

@Injectable()
export class GridService {
  predefinedRenderers: object;

  constructor(
    private converterService: ValueConverterService,
    private metadataService: MetadataService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
  ) {
    const dateTimeRenderer = (key: string) => ({ [key]: value }) => value ? this.converterService.ISOToLocalDateTime(value) : '';
    this.predefinedRenderers = { ...gridRenderers, dateTimeRenderer };
  }

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
   * @param {object} renderers Column renderers, i.e. getters
   * @returns {Promise<IAGridColumn[]>} Column defininitions
   */
  getColumnMeta(metadataKey: string, renderers: object): Promise<IAGridColumn[]> {
    const mapColumns = ([metadata, dictionaries]: [IMetadataColumn[], IUserDictionaries]) => {

      const columns: IAGridColumn[] = metadata
        .map(metaColumn => {
          return { ...metaColumn, colId: metaColumn.name } as IAGridColumn;
        })
        .map(column => {
          // Data types
          switch (column.dataType) {
            case 2:
              // Date
              column.renderer = (item: any) => this.converterService.ISOToLocalDate(item[column.colId]);
              break;
            case 6:
              // Dictionary
              const dictionary = dictionaries[column.dictCode];
              if (dictionary) {
                column.renderer = (row: ITypeCodeItem) => {
                  const cellValue = row[column.name];
                  const typeDescription = dictionary.find(item => item.code === cellValue);
                  return typeDescription ? typeDescription.name : cellValue;
                };
                column.filterValues = dictionary.map(item => ({ code: item.code, name: item.name }));
              }
              break;
            case 7:
              // Datetime
              column.renderer = (item: any) => this.converterService.ISOToLocalDateTime(item[column.colId]);
              break;
            case 1:
              // Number
            case 3:
              // String
            default:
          }
          return column;
      });
      return this.setValueGetters(columns, renderers);
    };

    return this.metadataService.getMetadata(metadataKey)
        .take(1)
        .toPromise()
        .then(metadata => {
          const dictionaryIds = metadata
            .filter(column => !!column.dictCode)
            .map(column => column.dictCode);

          return Promise.all([metadata, this.userDictionariesService.getDictionaries(dictionaryIds)]);
        })
        .then(mapColumns);
  }

  setRenderers(columns: IGridColumn[], renderers: object): IGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.prop];
      if (Object.prototype.toString.call(renderer) === '[object String]') {
        // NOTE: here `renderFn` is a function of type Function(key: string) => Function(obj[key]) => render stuff
        const renderFn: Function = this.predefinedRenderers[renderer];
        return renderFn ? this.setRenderer(column, renderFn(column.prop)) : column;
      }
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
