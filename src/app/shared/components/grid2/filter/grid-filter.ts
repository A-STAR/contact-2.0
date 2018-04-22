import { propEq } from 'ramda';

export type FilterConditionType = 'AND' | 'OR' | 'NOT AND' | 'NOT OR';

export type FilterOperatorType = '==' | '!=' | '>=' | '<=' | '>' | '<'
  | 'EMPTY'
  | 'NOT EMPTY'
  | 'IN'
  | 'NOT IN'
  | 'BETWEEN'
  | 'NOT BETWEEN'
  | 'LIKE'
  | 'NOT LIKE';

export class FilterObject {
  condition?: FilterConditionType;
  filters?: FilterObject[];
  list?: string;
  name?: string;
  operator?: FilterOperatorType;
  values?: Array<any>;

  static create(source?: FilterObject): FilterObject {
    const filter: FilterObject = new FilterObject();
    if (source) {
      filter
        .setList(source.list)
        .setName(source.name)
        .setCondition(source.condition)
        .setOperator(source.operator)
        .setValues(source.values);
      if (Array.isArray(source.filters)) {
        filter.setFilters(
          source.filters.map(_filter => FilterObject.create(_filter))
        );
      }
    }
    return filter;
  }

  and(): FilterObject {
    return this.setCondition('AND');
  }

  or(): FilterObject {
    return this.setCondition('OR');
  }

  setCondition(condition: FilterConditionType): FilterObject {
    if (condition) {
      this.condition = condition;
    }
    return this;
  }

  setList(list: string): FilterObject {
    if (list != null) {
      this.list = list;
    }
    return this;
  }

  setName(name: string): FilterObject {
    if (name != null) {
      this.name = name;
    }
    return this;
  }

  inOperator(): FilterObject {
    return this.setOperator('IN');
  }

  betweenOperator(): FilterObject {
    return this.setOperator('BETWEEN');
  }

  setOperator(operator: FilterOperatorType): FilterObject {
    this.operator = operator;
    return this;
  }

  addFilter(filter: FilterObject): FilterObject {
    if (filter && (filter.hasValues() || filter.hasFilter() || filter.hasList())) {
      if (!this.condition) {
        throw new Error('You must set a condition prior to adding a filter');
      }
      this.filters = (this.filters || []).concat(filter);
    }
    return this;
  }

  addFilters(filters: FilterObject[]): FilterObject {
    if (!this.condition) {
      throw new Error('You must set a condition prior to adding filters');
    }
    this.filters = (this.filters || []).concat(filters);
    return this;
  }

  setFilters(filters: FilterObject[]): FilterObject {
    this.filters = [].concat(filters);
    return this;
  }

  setValues(values: any | any[]): FilterObject {
    // skip null & undefined, since BE doesn't accept those
    if (values != null) {
      this.values = [].concat(values);
    }
    return this;
  }

  hasValues(): boolean {
    return this.values && this.values.length > 0;
  }

  hasFilter(): boolean {
    return this.filters && this.filters.length > 0;
  }

  hasList(): boolean {
    return !!this.list;
  }

  get(name: string): any {
    let found: any;

    if (propEq('name', name, this)) {
      found = this.values;
    } else {
      this.filters.some(function iter(filter: FilterObject): boolean {
        if (propEq('name', name, filter)) {
          found = filter.values;
          return true;
        }
        return Array.isArray(filter.filters) && filter.filters.some(iter);
      });
    }

    return found;
  }
}
