import { Injectable } from '@angular/core';

import { IGroup, IField, ILogicalOperator, ICondition, IMetadata, IComparisonOperator } from './qbuilder.interface';

const metadata: IMetadata = {
  fields: [{
    code: 'first_name',
    name: 'First Name',
    type: 'string',
    operators: [
      { name: '==' },
      { name: '!=' },
      { name: '<' },
      { name: '>' }
    ]
  }, {
    code: 'last_name',
    name: 'Last Name',
    type: 'string',
    operators: [
      { name: '==' },
      { name: '!=' },
      { name: '<' },
      { name: '>' }
    ]
  }, {
    code: 'birthdate',
    name: 'Birthdate',
    type: 'date',
    operators: [
      { name: '==' },
      { name: '!=' },
      { name: '<' },
      { name: '>' }
    ]
  }, {
    code: 'gender',
    name: 'Gender',
    type: [
      'Male',
      'Female'
    ],
    operators: [
      { name: '==' },
      { name: '!=' }
    ]
  }, {
    code: 'city',
    name: 'City',
    type: [ 'New York', 'Boston', 'Los Angeles', 'San Francisco' ],
    operators: [
      { name: '==' },
      { name: '!=' }
    ]
  }, {
    code: 'foo',
    name: 'Foo',
    type: 'currency',
    operators: [
      { name: '==' },
      { name: '!=' },
      { name: '<' },
      { name: '>' }
    ]
  }]
};

@Injectable()
export class QBuilderService {
  private metadata: IMetadata = metadata;

  private logicalOperators: Array<ILogicalOperator> = [
    { name: 'AND' },
    { name: 'OR' }
  ];

  constructor() { }

  getFields(): Array<IField> {
    return this.metadata.fields;
  }

  getLogicalOperators(): Array<ILogicalOperator> {
    return this.logicalOperators;
  }

  getComparisonOperators(condition: ICondition): Array<IComparisonOperator> {
    return condition.field.operators;
  }

  addCondition(parent: IGroup): void {
    parent.rules.push({
      field: this.metadata.fields[0],
      operator: null,
      value: null
    });
  }

  removeCondition(parent: IGroup, index: number): void {
    parent.rules.splice(index, 1);
  }

  addGroup(parent: IGroup): void {
    parent.rules.push({
      parent,
      operator: this.logicalOperators[0],
      rules: [],
    });
  }

  removeGroup(group: IGroup): void {
    if (!group.parent) {
      return;
    }
    group.parent.rules = group.parent.rules.filter(rule => !Object.hasOwnProperty.call(rule, 'rules') || rule !== group);
  }

  toJson(group: IGroup): string {
    return JSON.stringify(group, (key, value) => key === 'parent' ? undefined : value, 2);
  }

  toString(group: IGroup|ICondition): string {
    if (!group) { return ''; }
    const str = (group as IGroup).rules.reduce((acc, rule, i) => {
      if (i > 0) {
        acc += ` ${group.operator.name} `;
      }
      return acc + ((rule as IGroup).rules
          ? this.toString((rule as IGroup))
          : `${(rule as ICondition).field.code} ${rule.operator.name} ${(rule as ICondition).value}`);
    }, '');

    return `(${str})`;
  }
}
