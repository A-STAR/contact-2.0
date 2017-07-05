import { Injectable } from '@angular/core';
import * as moment from 'moment';

import {
  ILabeledValue,
  INamedValue,
  IOption,
  IValueEntity,
  ValueType
} from './value-converter.interface';

@Injectable()
export class ValueConverterService {
  // TODO(d.maltsev): move DATE_USER_PATTERN to locale files
  static DATE_USER_PATTERN = 'DD.MM.YYYY';
  static DATE_TIME_USER_PATTERN = 'DD.MM.YYYY HH:mm:ss';
  static DATE_TIME_ISO_PATTERN = 'YYYY-MM-DDTHH:mm:ss';

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

  toIsoDate(str: string): string {
    return this.parseDate(
      str,
      ValueConverterService.DATE_TIME_ISO_PATTERN,
      ValueConverterService.DATE_USER_PATTERN
    );
  }

  toIsoDateTime(str: string): string {
    return this.parseDate(
      str,
      ValueConverterService.DATE_TIME_ISO_PATTERN,
      ValueConverterService.DATE_TIME_USER_PATTERN
    );
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

  isoStringToDate(str: string): Date {
    return str ? new Date(str) : null;
  }

  stringToDate(str: string): Date {
    if (!str) {
      return null;
    }
    const momentDate = moment(str);
    return momentDate.isValid() ? momentDate.toDate() : null;
  }

  dateToString(date: Date, format: string = ValueConverterService.DATE_USER_PATTERN): string {
    return date ? moment(date).format(format) : '';
  }

  formatDate(str: string, format: string = ValueConverterService.DATE_USER_PATTERN): string {
    return this.dateToString(this.stringToDate(str), format);
  }

  formatDateTime(str: string, format: string = ValueConverterService.DATE_TIME_USER_PATTERN): string {
    return this.dateToString(this.stringToDate(str), format);
  }

  private parseDate(str: string, toPattern: string, fromPattern?: string): string {
    const momentDate = moment(str, fromPattern);
     return momentDate.isValid() ? momentDate.format(toPattern) : null;
  }
}
