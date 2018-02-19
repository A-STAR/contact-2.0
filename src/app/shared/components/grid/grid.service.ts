import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value-converter.interface';
import { IGridColumn, IRenderer, TRendererType, IMetadataDefs } from './grid.interface';
import { IAGridColumn, IAGridRequest, IAGridRequestParams, IAGridSorter } from '../../../shared/components/grid2/grid2.interface';
import { IMetadataAction, IMetadataColumn, IMetadata, IMetadataTitlebar } from '../../../core/metadata/metadata.interface';
import { IUserDictionaries } from '../../../core/user/dictionaries/user-dictionaries.interface';

import { LookupService } from '../../../core/lookup/lookup.service';
import { MetadataService } from '../../../core/metadata/metadata.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value-converter.service';

import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { renderers as gridRenderers, TYPE_CODES } from '../../../core/utils/index';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';

@Injectable()
export class GridService {
  private predefinedRenderers: object;

  constructor(
    private converterService: ValueConverterService,
    private lookupService: LookupService,
    private metadataService: MetadataService,
    private userDictionariesService: UserDictionariesService,
  ) {
    const dateTimeRenderer = (key: string) => ({ [key]: value }) => value ? this.converterService.ISOToLocalDateTime(value) : '';
    const dateRenderer = (key: string) => ({ [key]: value }) => value ? this.converterService.ISOToLocalDate(value) : '';
    this.predefinedRenderers = { ...gridRenderers, dateTimeRenderer, dateRenderer };
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
          .map(data => ({ ...data, titlebar: { items: [
            {
              name: 'search',
            },
          ]} }));
      });
  }

  getColumns(columns: any[], renderers: object): Observable<IAGridColumn[]> {
    const dictionaryIds = this.getDictionaryIdsFromColumns(columns);
    return this.buildColumns(columns, dictionaryIds, renderers);
  }

  setRenderers(columns: IGridColumn[], renderers?: IRenderer): IGridColumn[] {
    return renderers
      // Syntax 1: provide renderers in an object
      ? columns.map(column => {
          const renderer = renderers[column.prop];
          if (Object.prototype.toString.call(renderer) === '[object String]') {
            // NOTE: here `renderFn` is a function of type Function(key: string) => Function(obj[key]) => render stuff
            const renderFn: Function = this.predefinedRenderers[renderer as string];
            return renderFn ? this.setRenderer(column, renderFn(column.prop)) : column;
          }
          return renderer ? this.setRenderer(column, renderer as Function) : column;
        })
      // Syntax 2: provide renderers in the column's `renderer` property
      : columns.map(column => {
          const { renderer } = column;
          const type = Object.prototype.toString.call(renderer);
          if (type === 'function') {
            return column;
          }
          if ( type === '[object String]') {
            // NOTE: here `renderFn` is a function of type Function(key: string) => Function(obj[key]) => render stuff
            const renderFn: Function = this.predefinedRenderers[renderer as string];
            return renderFn ? this.setRenderer(column, renderFn(column.prop)) : column;
          }
          if (column.dictCode) {
            return column;
          }
          return renderer ? this.setRenderer(column, renderer as Function) : column;
        });
  }

  // NOTE: ag-grid only
  setValueGetters(columns: IAGridColumn[], renderers: object): IAGridColumn[] {
    return columns.map(column => {
      const renderer = renderers[column.colId];
      return renderer ? this.setValueGetter(column, renderer) : column;
    });
  }

  setAllRenderers(srcColumns: IGridColumn[]): Observable<IGridColumn[]> {
    const lookupKeys = srcColumns.filter(col => !!col.lookupKey).map(col => col.lookupKey);
    // 1. Set the lookup renderers
    const lookupColumnObs = !lookupKeys.length
      ? of([])
      : combineLatest(lookupKeys.map(key => {
          return this.lookupService.lookupAsOptions(key)
            .map(options => {
              const column = srcColumns.find(col => col.lookupKey === key);
              return this.setRenderer(column, options);
            });
        }));

    // 2. Set the dictionary renderers
    return combineLatest(this.setDictionaryRenderers(srcColumns), lookupColumnObs)
      .map(([columns, lookupColumns]) => {
        return columns.map(column => {
          const found = lookupColumns.find(col => col.lookupKey === column.lookupKey);
          return found ? found : column;
        });
      })
      .map(columns => {
        const renderers = columns.filter(col => typeof col.renderer === 'string')
          .reduce((acc, col) => {
            acc[col.prop] = col.renderer;
            return acc;
          }, {});
        // 3. Set the predefined renderers
        return this.setRenderers(columns, renderers);
      });
  }

  setDictionaryRenderers(columns: IGridColumn[]): Observable<IGridColumn[]> {
    const dictColumns = columns.filter(col => !!col.dictCode);
    const dictionaryIds = dictColumns.map(col => col.dictCode);

    return this.userDictionariesService.getDictionariesAsOptions(dictionaryIds)
      .map(dictionaries => {
        // Get the dictionaries and convert them to renderers
        const renderers = dictColumns.reduce((acc, col) => {
          acc[col.prop] = dictionaries[col.dictCode];
          return acc;
        }, {} as IRenderer);
        return this.setRenderers(columns, renderers);
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

  private setRenderer(column: IGridColumn, rendererFn: TRendererType): IGridColumn {
    const isArray = Array.isArray(rendererFn);
    const entities: ILabeledValue[] = isArray ? [].concat(rendererFn) : [];

    // NOTE: @swimlane's way to define a getter
    column.$$valueGetter = (entity: any, fieldName: string) => {
      const value: any = Reflect.get(entity, fieldName);

      if (isArray) {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.prop]);
        return labeledValue ? labeledValue.label : entity[column.prop];
      } else {

        return String((rendererFn as Function)(entity, value));
      }
    };
    /**
     * NOTE
     * The `renderer` can be a string (aka 'phoneRenderer'), a function or an array.
     * It should be possible and safe to reinitialize the rendereres. This is why we have to keep
     * the column's `renderer` property untouched, so that the renderer function should go to `$$valueGetter`
     */
    // This is no longer applied
    // column.renderer = column.$$valueGetter;
    return column;
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
