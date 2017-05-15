import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IValueEntity, ValueType } from './value-converter.interface';

@Injectable()
export class ValueConverterService {

  constructor(private datePipe: DatePipe) {
  }

  public serialize(valueEntity: IValueEntity): IValueEntity {
    switch (valueEntity.typeCode) {
      case 1:
        valueEntity.valueN = this.toNumber(valueEntity.value);
        break;
      case 3:
        valueEntity.valueS = valueEntity.value as string;
        break;
      case 4:
        valueEntity.valueB = this.toNumber(valueEntity.value);
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
        valueEntity.value = this.datePipe.transform(new Date(valueEntity.valueD), 'dd.MM.yyyy HH:mm:ss');
        break;
      case 3:
        valueEntity.value = valueEntity.valueS || '';
        break;
      case 4:
        valueEntity.value = valueEntity.valueB;
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
    const booleanValue: number = this.toNumber(valueEntity.value);
    if (valueEntity.typeCode === 1 || valueEntity.typeCode === 3) {
      return valueEntity.value;
    } else if (valueEntity.typeCode === 4) {
      return booleanValue === 1 ? 'Истина' : 'Ложь'; // TODO translator
    }
    return booleanValue;
  }

  private toNumber(value: ValueType): number {
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
