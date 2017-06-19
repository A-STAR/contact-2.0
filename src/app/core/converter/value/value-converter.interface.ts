import * as R from 'ramda';

export type ValueType = string | number | boolean;

export interface IValueEntity {
  typeCode?: number;
  valueB?: number | boolean;
  valueS?: string;
  valueN?: number;
  valueD?: string;
  value?: ValueType;
}

export interface ILabeledValue {
  value: any;
  label?: string;
  selected?: boolean;
  removed?: boolean;
  canRemove?: boolean;
  context?: any;
}

export type FilteringType = 'AND' | 'OR';

export type FilteringOperatorType = '==' | '!=' | '>=' | '<=' | '>' | '<' | 'EMPTY' | 'NOT EMPTY' | 'IN' | 'NOT IN'
  | 'BETWEEN' | 'NOT BETWEEN' | 'LIKE' | 'NOT LIKE';

export interface IFilteringObject {
  condition?: FilteringType;
  filters?: IFilteringObject[];
  name?: string;
  operator?: FilteringOperatorType;
  valueArray?: any[];
  value?: any;
}

export class FilterObject implements IFilteringObject {

  name: string;
  condition: FilteringType;
  filters: IFilteringObject[];
  operator: FilteringOperatorType;
  value?: any;
  valueArray?: any[];

  static create(): FilterObject {
    return new FilterObject();
  }

  constructor() {
  }

  addFilter(filter: FilterObject): FilterObject {
    if (filter.hasValue()) {
      this.filters = (this.filters || []).concat(filter);
    }
    return this;
  }

  and(): FilterObject {
    return this.setCondition('AND');
  }

  setCondition(condition: FilteringType): FilterObject {
    this.condition = condition;
    return this;
  }

  setName(name: string): FilterObject {
    this.name = name;
    return this;
  }

  inOperator(): FilterObject {
    return this.setOperator('IN');
  }

  setOperator(operator: FilteringOperatorType): FilterObject {
    this.operator = operator;
    return this;
  }

  setValue(value: any): FilterObject {
    this.value = value;
    return this;
  }

  setValueArray(valueArray: any[]): FilterObject {
    this.valueArray = valueArray;
    return this;
  }

  hasValue(): boolean {
    return !R.isNil(this.value) || (!R.isNil(this.valueArray) && this.valueArray.length > 0);
  }
}
