import { Injectable } from '@angular/core';

import { IGroup, IField, IOperator, ICondition } from './qbuilder.interface';

@Injectable()
export class QBuilderService {

  constructor() { }

  getFields(): Array<IField> {
    return [
      { name: 'Firstname' },
      { name: 'Lastname' },
      { name: 'Birthdate' },
      { name: 'City' },
      { name: 'Country' }
    ];
  }

  getOperators(): Array<IOperator> {
    return [
      { name: 'AND' },
      { name: 'OR' }
    ];
  }

  getConditions(): Array<IField> {
    return [
      { name: '=' },
      { name: '<>' },
      { name: '<' },
      { name: '<=' },
      { name: '>' },
      { name: '>=' }
    ];
  }

  addCondition(group: IGroup): void {
    const field = this.getFields()[0].name;
    group.rules.push({
      condition: '=',
      field: field,
      data: ''
    });
  }

  removeCondition(group: IGroup, index: number): void {
    group.rules.splice(index, 1);
  }

  addGroup(group: IGroup): void {
    group.rules.push({
      parent: group,
      operator: 'AND',
      rules: []
    });
  }

  removeGroup(group: IGroup) {
    if (!group.parent) { return; }
    group.parent.rules = group.parent.rules.filter(el => {
      return Object.hasOwnProperty.call(el, 'rules') && el === group
        ? false
        : true;
    });
  }

  toJson(group: IGroup): string {
    return JSON.stringify(group, (key, value) => key === 'parent' ? undefined : value, 2);
  }

  toString(group): string {
    if (!group) { return ''; }
    const str = group.rules.reduce((acc, rule, i) => {
      if (i > 0) {
        acc += ` ${group.operator} `;
      }
      return acc + (
        rule.rules
        ? this.toString(rule)
        : `${rule.field} ${rule.condition} ${rule.data}`
      );
    }, '');

    return `(${str})`;
  }

}
