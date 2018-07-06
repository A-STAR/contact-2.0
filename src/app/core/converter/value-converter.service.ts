import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import {
  IDecimalFormats,
  ILabeledValue,
  INamedValue,
  IOption,
  IValueEntity,
  ValueType,
} from './value-converter.interface';

@Injectable()
export class ValueConverterService {
  private decimalFormat: IDecimalFormats = {
    minIntegerDigits: 1,
    minFractionDigits: 0,
    maxFractionDigits: 2
  };

  constructor(
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService
  ) {}

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
      case 6:
        valueEntity.value = valueEntity.valueN;
        break;
      case 2:
        valueEntity.value = this.toLocalDate(valueEntity.valueD);
        break;
      case 3:
        valueEntity.value = valueEntity.valueS || '';
        break;
      case 4:
        valueEntity.value = String(valueEntity.valueB);
        break;
      case 5:
        valueEntity.value = Number(valueEntity.valueN).toFixed(2);
        break;
      case 7:
        valueEntity.value = this.toLocalDateTime(valueEntity.valueD);
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
      return this.translateService.instant(
        Number(valueEntity.value) === 1 ? 'default.boolean.TRUE' : 'default.boolean.FALSE'
      );
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
    const v = this.toLabeledValues(data);
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

  toISO(date: Date): string {
    return date ? date.toISOString() : null;
  }

  toLocalDateTime(date: Date | string): string {
    return this.formatDate(date, 'L HH:mm:ss');
  }

  toLocalTime(date: Date | string): string {
    return date ? moment(date).format('HH:mm:ss') : null;
  }

  toLocalDate(date: Date | string): string {
    return this.formatDate(date, 'L');
  }

  formatNumber(num: number | string): string {
    if (this.decimalFormat) {
      return this.decimalPipe.transform(
        num,
        `${this.decimalFormat.minIntegerDigits}.${this.decimalFormat.minIntegerDigits}-${this.decimalFormat.maxFractionDigits}`,
      );
    }
  }

  get locale(): string {
    const { currentLang, defaultLang } = this.translateService;
    return currentLang || defaultLang;
  }

  toDateOnly(date: Date): string {
    return date ? moment(date).utcOffset(0, true).format('YYYY-MM-DD') : null;
  }

  fromISO(value: string): Date {
    return value ? new Date(value) : null;
  }

  fromLocalDateTime(value: string): Date | false {
    return this.fromLocal(value, 'L HH:mm:ss' as moment.LongDateFormatKey);
  }

  fromLocalDate(value: string): Date | false {
    return this.fromLocal(value, 'L' as moment.LongDateFormatKey);
  }

  fromLocalTime(value: string): Date | false {
    return this.fromLocal(value, 'HH:mm:ss' as moment.LongDateFormatKey);
  }

  dateStringToISO(date: string): string {
    return moment(date, 'YYYY-MM-DD').toISOString();
  }

  formatDate(date: Date | string, format: string): string {
    return date ? moment(date).locale(this.locale).format(format) : null;
  }

  makeRangeFromLocalDate(value: string): Array<string> {
    const from = moment(value);
    const to = from.clone().add(1, 'day').subtract(1, 'second');
    return from.isValid() ? [from.toISOString(), to.toISOString()] : [];
  }

  private fromLocal(value: string, key: moment.LongDateFormatKey): Date | false {
    const date = value && moment(value, key, true);
    if (!date) {
      return null;
    }
    return date.isValid() ? date.toDate() : false;
  }
}
