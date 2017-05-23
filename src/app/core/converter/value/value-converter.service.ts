import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { ILabeledValue, ILocalizedValue, IValueEntity, ValueType } from './value-converter.interface';

@Injectable()
export class ValueConverterService {

  private _localizedValues: ILocalizedValue = {};

  constructor(private datePipe: DatePipe, private translateService: TranslateService) {
    this.translateService.get('default.boolean.TRUE')
      .subscribe((v: string) => this._localizedValues.trueValue = v);
    this.translateService.get('default.boolean.FALSE')
      .subscribe((v: string) => this._localizedValues.falseValue = v);
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
    const booleanValue: number = this.toNumber(valueEntity.value);
    if (valueEntity.typeCode === 1 || valueEntity.typeCode === 3) {
      return valueEntity.value;
    } else if (valueEntity.typeCode === 4) {
      return booleanValue === 1
        ? this._localizedValues.trueValue
        : this._localizedValues.falseValue;
    }
    return booleanValue;
  }

  public toLabeledValues(data: number|ILabeledValue[]): number|any[] {
    if (Array.isArray(data)) {
      return data.map((labeledValue: ILabeledValue) => labeledValue.value);
    }
    return data;
  }

  public firstLabeledValue(data: number|ILabeledValue[]): number|any[] {
    const array: number|any[] = this.toLabeledValues(data);
    if (Array.isArray(array)) {
      return array && array.length ? array[0] : data;
    } else {
      return data;
    }
  }

  public toNumber(value: ValueType): number {
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
