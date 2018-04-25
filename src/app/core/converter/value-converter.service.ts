import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators/first';
import * as moment from 'moment';

import {
  IDecimalFormats,
  IDateFormats,
  ILabeledValue,
  INamedValue,
  IOption,
  IValueEntity,
  ValueType,
} from './value-converter.interface';

@Injectable()
export class ValueConverterService {
  private formats: IDateFormats;
  private decimalFormat: IDecimalFormats;

  constructor(
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService
  ) {
    this.translateService.get('default.date.format')
      .pipe(first())
      .subscribe(dateFormats => this.formats = dateFormats);

    this.translateService.get('default.decimal.format')
      .pipe(first())
      .subscribe(decimalFormat => this.decimalFormat = decimalFormat);
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
      case 6:
        valueEntity.value = valueEntity.valueN;
        break;
      case 2:
        valueEntity.value = this.ISOToLocalDate(valueEntity.valueD);
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
        valueEntity.value = this.ISOToLocalDateTime(valueEntity.valueD);
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

  toLocalDateTime(date: Date): string {
    return this.toLocal(date, this.formats.dateTime);
  }

  toLocalTime(date: Date): string {
    return moment(date).isValid()
      ? moment(date, this.formats.dateISO).format(this.formats.time)
      : null;
  }

  toLocalDate(date: Date): string {
    return this.toLocal(date, this.formats.date);
  }

  formatNumber(num: number | string): string {
    if (this.decimalFormat) {
      return this.decimalPipe.transform(
        num,
        `${this.decimalFormat.minIntegerDigits}.${this.decimalFormat.minIntegerDigits}-${this.decimalFormat.maxFractionDigits}`,
      );
    }
  }

  toDateOnly(date: Date): string {
    return moment(date).utcOffset(0, true).format(this.formats.dateISO);
  }

  fromISO(value: string): Date {
    return value ? new Date(value) : null;
  }

  fromLocalDateTime(value: string): Date | false {
    return this.fromLocal(value, this.formats.dateTime);
  }

  fromLocalDate(value: string): Date | false {
    return this.fromLocal(value, this.formats.date);
  }

  fromLocalTime(value: string): Date | false {
    return this.fromLocal(value, this.formats.time);
  }

  dateStringToISO(date: string): string {
    return moment(date, this.formats.dateISO).toISOString();
  }

  makeRangeFromLocalDate(value: string): Array<string> {
    const from = moment(value);
    const to = from.clone().add(1, 'day').subtract(1, 'second');
    return from.isValid() ? [from.toISOString(), to.toISOString()] : [];
  }

  /**
   * @deprecated
   */
  ISOToLocalDateTime(value: string): string {
    return this.toLocalDateTime(this.fromISO(value));
  }

  /**
   * @deprecated
   */
  ISOToLocalDate(value: string): string {
    return this.toLocalDate(this.fromISO(value));
  }

  private toLocal(date: Date, format: string): string {
    return date ? moment(date).format(format) : null;
  }

  private fromLocal(value: string, format: string): Date | false {
    const date = value && moment(value, format, true);
    if (!date) {
      return null;
    }
    return date.isValid() ? date.toDate() : false;
  }
}
