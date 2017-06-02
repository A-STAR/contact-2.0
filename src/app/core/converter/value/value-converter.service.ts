import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { ILabeledValue, IValueEntity, ValueType } from './value-converter.interface';

@Injectable()
export class ValueConverterService {

  constructor() {
  }

  serialize(valueEntity: IValueEntity): IValueEntity {
    switch (valueEntity.typeCode) {
      case 1:
        valueEntity.valueN = this.toBooleanNumber(valueEntity.value);
        break;
      case 3:
        valueEntity.valueS = valueEntity.value as string;
        break;
      case 4:
        valueEntity.valueB = this.toBooleanNumber(valueEntity.value);
        break;
    }
    delete valueEntity.value;
    return valueEntity;
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
    if (!dataSet) {
      return [];
    }
    return dataSet.map((valueEntity: IValueEntity) => this.deserialize(valueEntity));
  }

  deserializeBooleanViewValue(valueEntity: IValueEntity): ValueType {
    if (valueEntity.typeCode === 4) {
      return this.toBooleanNumber(valueEntity.value) === 1
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
      return v && v.length ? v[0] : data;
    }
    return v;
  }

  toBooleanNumber(value: ValueType): number {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'boolean') {
      return value ? 1 : 0;
    } else if (typeof value === 'string') {
      return parseInt(value as string, 10) ? 1 : 0;
    }
    return value;
  }

  formatDate(dateAsString: string, useTime: boolean = false) {
    const momentDate = moment(dateAsString);
    if (momentDate.isValid()) {
      return useTime
        ? momentDate.format('DD.MM.YYYY hh:mm:ss')
        : momentDate.format('DD.MM.YYYY');
    } else {
      return dateAsString;
    }
  }
}
