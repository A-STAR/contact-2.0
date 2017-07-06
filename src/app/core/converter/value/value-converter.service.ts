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
  static LOCAL_DATE_FORMAT = 'DD.MM.YYYY';
  static LOCAL_DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm:ss';

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
        valueEntity.value = this.isoToLocalDate(valueEntity.valueD);
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

  valuesToOptions(values: Array<INamedValue>): Array<IOption> {
    return values.map(value => ({
      label: value.name,
      value: value.id
    }));
  }

  toIso(date: Date): string {
    return date ? date.toISOString() : null;
  }

  toLocalDateTime(date: Date): string {
    return this.toLocal(date, ValueConverterService.LOCAL_DATE_TIME_FORMAT);
  }

  toLocalDate(date: Date): string {
    return this.toLocal(date, ValueConverterService.LOCAL_DATE_FORMAT);
  }

  fromIso(value: string): Date {
    return value ? new Date(value) : null;
  }

  fromLocalDateTime(value: string): Date {
    return this.fromLocal(value, ValueConverterService.LOCAL_DATE_TIME_FORMAT);
  }

  fromLocalDate(value: string): Date {
    return this.fromLocal(value, ValueConverterService.LOCAL_DATE_FORMAT);
  }

  /**
   * @deprecated
   */
  isoToLocalDateTime(value: string): string {
    return this.toLocalDateTime(this.fromIso(value));
  }

  /**
   * @deprecated
   */
  isoToLocalDate(value: string): string {
    return this.toLocalDate(this.fromIso(value));
  }

  /**
   * @deprecated
   */
  isoFromLocalDateTime(value: string): string {
    return this.toIso(this.fromLocalDateTime(value));
  }

  private toLocal(date: Date, format: string): string {
    return date ? moment(date).format(format) : null;
  }

  private fromLocal(value: string, format: string): Date {
    const date = value && moment(value, format, true);
    return date && date.isValid() ? date.toDate() : null;
  }
}
