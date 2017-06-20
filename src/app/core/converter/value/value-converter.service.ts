import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as R from 'ramda';

import {
  FilterObject,
  ILabeledValue,
  IValueEntity,
  ValueType
} from './value-converter.interface';
import {
  IGrid2ColumnSettings,
  IGrid2Request,
  IGrid2RequestPayload,
  IGrid2RequestSorting,
} from '../../../shared/components/grid2/grid2.interface';

@Injectable()
export class ValueConverterService {

  static DATE_USER_PATTERN = 'DD.MM.YYYY';
  static DATE_TIME_USER_PATTERN = 'DD.MM.YYYY HH:mm:ss';
  static DATE_TIME_ISO_PATTERN = 'YYYY-MM-DDTHH:mm:ss';

  constructor(
    private datePipe: DatePipe
  ) { }

  toGridRequest(payload: IGrid2RequestPayload): IGrid2Request {
    const request: IGrid2Request = {};
    const filter: FilterObject = FilterObject.create().and();

    if (payload.columnsSettings) {
      R.forEach((columnSettings: IGrid2ColumnSettings) => {
        const originalFilter: FilterObject = columnSettings.filter;
        filter.addFilter(
          FilterObject.create(originalFilter, { name:  payload.fieldNameConverter })
        );
      }, R.values(payload.columnsSettings));

      request.filtering = filter;

      const sorting: IGrid2RequestSorting[] = R.values(R.mapObjIndexed(
        (columnSettings: IGrid2ColumnSettings, columnId: string) => {
          return {
            field: payload.fieldNameConverter ? payload.fieldNameConverter(columnId) : columnId,
            order: columnSettings.sortingOrder,
            direction: columnSettings.sortingDirection ? 'desc' : 'asc'
          };
        },
        payload.columnsSettings
      ));
      if (sorting.length) {
        request.sorting = R.map((v: IGrid2RequestSorting) => {
          return {
            field: v.field,
            direction: v.direction
          };
        }, sorting.sort((o1: IGrid2RequestSorting, o2: IGrid2RequestSorting) => {
          return o1.order === o2.order ? 0 : (o1.order > o2.order ? 1 : -1);
        }));
      }
    }
    if (!R.isNil(payload.currentPage) && !R.isNil(payload.pageSize)) {
      request.paging = {
        pageNumber: payload.currentPage,
        resultsPerPage: payload.pageSize
      };
    }
    return request;
  }

  serialize(valueEntity: IValueEntity): IValueEntity {
    const result: IValueEntity = Object.assign({}, valueEntity);
    switch (result.typeCode) {
      case 1:
        result.valueN = Number(result.value);
        break;
      case 3:
        result.valueS = String(result.value);
        break;
      case 4:
        result.valueB = Number(result.value);
        break;
    }
    delete result.value;
    return result;
  }

  deserialize(valueEntity: IValueEntity): IValueEntity {
    switch (valueEntity.typeCode) {
      case 1:
        valueEntity.value = valueEntity.valueN;
        break;
      case 2:
        valueEntity.value = this.formatDate(valueEntity.valueD);
        break;
      case 3:
        valueEntity.value = valueEntity.valueS || '';
        break;
      case 4:
        valueEntity.value = String(valueEntity.valueB);
        break;
      default:
        valueEntity.value = '';
    }
    return valueEntity;
  }

  deserializeSet(dataSet: IValueEntity[]): IValueEntity[] {
    return (dataSet || []).map((valueEntity: IValueEntity) => this.deserialize(valueEntity));
  }

  deserializeBoolean(valueEntity: IValueEntity): ValueType {
    if (valueEntity.typeCode === 4) {
      // TODO(a.tymchuk): use dictionary service
      return Number(valueEntity.value) === 1
        ? 'default.boolean.TRUE'
        : 'default.boolean.FALSE';
    }
    return valueEntity.value;
  }

  toLabeledValues(data: string|number|ILabeledValue[]): number|any[] {
    if (data === '') {
      return null;
    }
    if (Array.isArray(data)) {
      return data.map((labeledValue: ILabeledValue) => labeledValue.value);
    }
    return data as number;
  }

  firstLabeledValue(data: string|number|ILabeledValue[]): number|any[] {
    const v: number|any[] = this.toLabeledValues(data);
    if (Array.isArray(v)) {
      return v.length ? v[0] : data;
    }
    return v;
  }

  formatDate(dateAsString: string, useTime: boolean = false): string {
    return this.parseDate(
      dateAsString,
      useTime ? ValueConverterService.DATE_TIME_USER_PATTERN : ValueConverterService.DATE_USER_PATTERN
    );
  }

  toIsoDateTime(dateAsString: string, useTime: boolean = false): string {
    return this.parseDate(
      dateAsString,
      ValueConverterService.DATE_TIME_ISO_PATTERN,
      useTime ? ValueConverterService.DATE_TIME_USER_PATTERN : ValueConverterService.DATE_USER_PATTERN
    );
  }

  valueToIsoDate(value: any): string {
    if (!value) {
      return null;
    }
    const converted = value.split('.').reverse().map(Number);
    return this.datePipe.transform(new Date(converted), 'yyyy-MM-ddTHH:mm:ss') + 'Z';
  }

  private parseDate(dateAsString: string, toPattern: string, fromPattern?: string): string {
    const momentDate = moment(dateAsString, fromPattern);
    if (momentDate.isValid()) {
      return momentDate.format(toPattern);
    }
  }
}
