import { Injectable } from '@angular/core';
import { IValueEntity, ValueType } from './value-converter.interface';

@Injectable()
export class ValueConverterService {

  constructor() {
  }

  public serialize(valueEntity: IValueEntity) {
    switch (valueEntity.typeCode) {
      case 1:
        valueEntity.valueN = this.toNumber(valueEntity.value);
        break;
      case 3:
        valueEntity.valueS = valueEntity as string;
        break;
      case 4:
        valueEntity.valueB = this.toNumber(valueEntity.value);
        break;
    }
    delete valueEntity.value;
    return valueEntity;
  }

  public deserializeBooleanViewValue(valueEntity: IValueEntity): ValueType {
    const booleanValue: number = this.toNumber(valueEntity.value);
    if (valueEntity.typeCode === 4) {
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
