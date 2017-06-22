import * as R from 'ramda';

export type FilteringConditionType = 'AND' | 'OR';

export class FilteringOperators {
  static EQUAL: FilteringOperatorType = '==';
  static NOT_EQUAL: FilteringOperatorType = '!=';
  static EMPTY: FilteringOperatorType = 'EMPTY';
}

export type FilteringOperatorType = '==' | '!=' | '>=' | '<=' | '>' | '<' | 'EMPTY' | 'NOT EMPTY' | 'IN' | 'NOT IN'
  | 'BETWEEN' | 'NOT BETWEEN' | 'LIKE' | 'NOT LIKE';

export interface IFilterBaseObject {
  condition?: FilteringConditionType;
  filters?: IFilterBaseObject[];
  name?: string;
  operator?: FilteringOperatorType;
  valueArray?: any[];
  value?: any;
}

export class FilterObject implements IFilterBaseObject {

  name: string;
  condition: FilteringConditionType;
  filters: IFilterBaseObject[];
  operator: FilteringOperatorType;
  value?: any;
  valueArray?: any[];

  static create(source?: FilterObject, decorators?: { name: Function }): FilterObject {
    let filter: FilterObject = new FilterObject();
    if (!R.isNil(source)) {
      filter = filter
        .setName(decorators.name ? decorators.name(source.name) : source.name)
        .setValue(source.value)
        .setValueArray(source.valueArray)
        .setCondition(source.condition)
        .setOperator(source.operator);
      if (Array.isArray(source.filters) && source.filters.length) {
        filter.setFilters(
          source.filters.map((_filter: FilterObject) => FilterObject.create(_filter, decorators))
        );
      }
    }
    return filter;
  }

  constructor() {
  }

  addFilter(filter: FilterObject): FilterObject {
    if (filter && (filter.hasValue() || filter.hasFilter())) {
      this.filters = (this.filters || []).concat(filter);
    }
    return this;
  }

  and(): FilterObject {
    return this.setCondition('AND');
  }

  setCondition(condition: FilteringConditionType): FilterObject {
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

  betweenOperator(): FilterObject {
    return this.setOperator('BETWEEN');
  }

  setOperator(operator: FilteringOperatorType): FilterObject {
    this.operator = operator;
    return this;
  }

  setFilters(filters: IFilterBaseObject[]): FilterObject {
    this.filters = filters;
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

  hasFilter(): boolean {
    return Array.isArray(this.filters) && this.filters.length > 0;
  }
}