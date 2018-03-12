import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value-converter.interface';
import { IMetadataDefs, TRendererType } from './grid.interface';
import { IAGridColumn, IAGridRequest, IAGridRequestParams, IAGridSorter } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataColumn } from '../../../core/metadata/metadata.interface';
import { IUserDictionaries } from '../../../core/user/dictionaries/user-dictionaries.interface';

import { MetadataService } from '../../../core/metadata/metadata.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { renderers as gridRenderers, TYPE_CODES } from '../../../core/utils/index';

@Injectable()
export class GridService {
  constructor(
    private converterService: ValueConverterService,
    private metadataService: MetadataService,
    private userDictionariesService: UserDictionariesService,
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
    const { sorters, currentPage, pageSize } = params;

    if (sorters) {
      request.sorting = sorters.map(col => {
        return { field: col.colId, direction: col.sort } as IAGridSorter;
      });
    }

    if (filters && (filters.hasFilter() || filters.hasValues())) {
      request.filtering = filters;
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
   * Builds column defs and actions from server metadata
   * To be used only once during ngOnInit phase
   *
   * @param {string} metadataKey The key used to retrieve coldefs the from the metadata service
   * @param {object} renderers Column renderers, i.e. getters
   * @returns {Observable<IMetadataDefs>} Actions, column & titlebar defininitions
   */
  getMetadata(metadataKey: string, renderers: object): Observable<IMetadataDefs> {
    return this.metadataService.getData(metadataKey)
      .flatMap(metadata => {
        const { columns } = metadata;
        const dictionaryIds = this.getDictionaryIdsFromColumns(columns);
        return this.buildColumns(columns, dictionaryIds, renderers)
          .map(cols => ({ ...metadata, columns: cols as IAGridColumn[] }))
          // TODO(i.lobanov): remove mock when added in config
          .map(data => ({
            ...data,
            titlebar: {
              items: [
                {
                  name: 'search',
                },
                {
                  name: 'exportExcel',
                },
              ]
            }
          }));
      });
  }

  getColumns(columns: any[], renderers: object): Observable<IAGridColumn[]> {
    const dictionaryIds = this.getDictionaryIdsFromColumns(columns);
    return this.buildColumns(columns, dictionaryIds, renderers);
  }

  // NOTE: ag-grid only
  setValueGetters(columns: IAGridColumn[], renderers: object): IAGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.colId];
      return renderer ? this.setValueGetter(column, renderer) : column;
    });
  }

  private getDictionaryIdsFromColumns(columns: IMetadataColumn[]): number[] {
    return columns
      .filter(column => !!column.dictCode)
      .map(column => column.dictCode);
  }

  private buildColumns(columns: IMetadataColumn[], dictionaryIds: number[], renderers: object): Observable<IAGridColumn[]> {
    return this.userDictionariesService.getDictionaries(dictionaryIds)
      .map(dictionaries => [ columns, dictionaries ])
      .map(this.mapColumns(renderers));
  }

  private mapColumns(renderers: object): any {
    return ([metadata, dictionaries]: [IMetadataColumn[], IUserDictionaries]) => {
      const columns: IAGridColumn[] = metadata
        .map(metaColumn => {
          return { ...metaColumn, colId: metaColumn.name } as IAGridColumn;
        })
        .map(column => {
          // Data types
          switch (column.dataType) {
            case TYPE_CODES.DATE:
              column.$$valueGetter = (value: any) => this.converterService.ISOToLocalDate(value);
              break;
            case TYPE_CODES.DICT:
              const dictionary = dictionaries[column.dictCode];
              if (dictionary) {
                const dictionaryHash = dictionary.reduce((acc, item) => { acc[item.code] = item.name; return acc; }, {});
                column.$$valueGetter = (value: any) => {
                  const dictValue = dictionaryHash[value];
                  return dictValue !== undefined ? dictValue : value;
                };
                column.filterValues = dictionary.map(item => ({ code: item.code, name: item.name }));
              }
              break;
            case TYPE_CODES.DATETIME:
              column.$$valueGetter = (value: any) => this.converterService.ISOToLocalDateTime(value);
              break;
            case TYPE_CODES.NUMBER:
            case TYPE_CODES.STRING:
            default:
          }
        return column;
      });
      return this.setValueGetters(columns, renderers);
    };
  }

  // NOTE: ag-grid only
  private setValueGetter(column: IAGridColumn, getterFn: TRendererType): IAGridColumn {
    const isArray = Array.isArray(getterFn);
    const entities: ILabeledValue[] = isArray ? [].concat(getterFn) : [];

    column.$$valueGetter = (entity: any, fieldName: string) => {
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
