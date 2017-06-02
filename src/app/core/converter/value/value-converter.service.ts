import { Injectable } from '@angular/core';

import { ILabeledValue, IValueEntity, ValueType } from './value-converter.interface';
import { DateConverterService } from '../date/date-converter.service';

@Injectable()
export class ValueConverterService {

  constructor(private dateConverterService: DateConverterService) {
  }

  public serialize(valueEntity: IValueEntity): IValueEntity {
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

  public deserialize(valueEntity: IValueEntity): IValueEntity {
    switch (valueEntity.typeCode) {
      case 1:
        valueEntity.value = valueEntity.valueN;
        break;
      case 2:
        valueEntity.value = this.dateConverterService.formatDate(valueEntity.valueD);
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

  public deserializeSet(dataSet: IValueEntity[]): IValueEntity[] {
    if (!dataSet) {
      return [];
    }
    return dataSet.map((valueEntity: IValueEntity) => this.deserialize(valueEntity));
  }

  public deserializeBooleanViewValue(valueEntity: IValueEntity): ValueType {
    if (valueEntity.typeCode === 4) {
      return this.toBooleanNumber(valueEntity.value) === 1
        ? 'default.boolean.TRUE'
        : 'default.boolean.FALSE';
    }
    return valueEntity.value;
  }

  public toLabeledValues(data: string|number|ILabeledValue[]): number|any[] {
    if (data === '') {
      return null;
    }
    if (Array.isArray(data)) {
      return data.map((labeledValue: ILabeledValue) => labeledValue.value);
    }
    return data as number;
  }

  public firstLabeledValue(data: string|number|ILabeledValue[]): number|any[] {
    const v: number|any[] = this.toLabeledValues(data);
    if (Array.isArray(v)) {
      return v && v.length ? v[0] : data;
    }
    return v;
  }

  public toBooleanNumber(value: ValueType): number {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'boolean') {
      return value ? 1 : 0;
    } else if (typeof value === 'string') {
      return parseInt(value as string, 10) ? 1 : 0;
    }
    return value;
  }
}
