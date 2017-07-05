import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/finally';
import * as R from 'ramda';

import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn, IRenderer } from './grid.interface';
import { ITypeCodeItem } from '../../../core/dictionaries/dictionaries.interface';

import { MetadataService } from '../../../core/metadata/metadata.service';
import { DictionariesService } from '../../../core/dictionaries/dictionaries.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

@Injectable()
export class GridService {
  constructor(
    private converterService: ValueConverterService,
    private dictionariesService: DictionariesService,
    private metadataService: MetadataService,
    private translateService: TranslateService,
  ) {}

  /**
   * Builds column defs from server metadata
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
                      column.renderer = (item: any) => this.converterService.formatDate(item[column.prop]);
                      break;
                    case 7:
                      // Date time
                      column.renderer = (item: any) => this.converterService.formatDateTime(item[column.prop]);
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
}
