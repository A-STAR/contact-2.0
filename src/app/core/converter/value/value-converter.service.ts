import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as R from 'ramda';

import {
  ILabeledValue,
  INamedValue,
  IOption,
  IValueEntity,
  ValueType
} from './value-converter.interface';
import {
  IGrid2ColumnSettings,
  IGrid2Request,
  IGrid2RequestPayload,
  Grid2SortingEnum,
} from '../../../shared/components/grid2/grid2.interface';

import { FilterObject } from '../../../shared/components/grid2/filter/grid2-filter';

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
    const filters: FilterObject = FilterObject.create().and();

    if (payload.columnsSettings) {
      R.forEach((columnSettings: IGrid2ColumnSettings) => {
        const { filter } = columnSettings;
        filter.addFilter(
          FilterObject.create(filter, { name:  payload.fieldNameConverter })
        );
      }, R.values(payload.columnsSettings));

      request.filtering = filters;

      request.sorting = R.values(R.mapObjIndexed(
        (columnSettings: IGrid2ColumnSettings, columnId: string) => ({
            direction: columnSettings.sortingDirection,
            field: payload.fieldNameConverter ? payload.fieldNameConverter(columnId) : columnId,
            order: columnSettings.sortingOrder,
        }),
        payload.columnsSettings
      ))
      .filter(s => s.direction !== Grid2SortingEnum.NONE)
      .sort((s1, s2) => s1.order > s2.order ? 1 : -1)
      .map(v => ({
        field: v.field,
        direction: v.direction === Grid2SortingEnum.ASC ? 'asc' : 'desc'
      }));
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

  valuesToOptions(values: Array<INamedValue>): Array<IOption> {
    return values.map(value => ({
      label: value.name,
      value: value.id
    }));
  }

  dateToIsoString(date: Date): string {
    return date ? date.toISOString().split('.')[0] + 'Z' : null;
  }

  isoStringToDate(date: string): Date {
    return date ? new Date(date) : null;
  }

  stringToDate(date: string): Date {
    if (!date) {
      return null;
    }
    const momentDate = moment(date, ValueConverterService.DATE_USER_PATTERN);
    return momentDate.isValid() ? momentDate.toDate() : null;
  }

  dateToString(date: Date): string {
    return date ? moment(date).format(ValueConverterService.DATE_USER_PATTERN) : null;
  }

  private parseDate(dateAsString: string, toPattern: string, fromPattern?: string): string {
    const momentDate = moment(dateAsString, fromPattern);
    if (momentDate.isValid()) {
      return momentDate.format(toPattern);
    }
  }
}
