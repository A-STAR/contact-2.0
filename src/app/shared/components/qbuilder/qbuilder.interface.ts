export interface IGroup {
  parent?: IGroup;
  operator: ILogicalOperator;
  rules: Array<IGroup | ICondition>;
}

export interface IField {
  code: string;
  name: string;
  type: 'boolean' | 'number' | 'date' | 'string' | Array<string>;
  operators?: Array<IComparisonOperator>;
}

export interface IComparisonOperator {
  name: string;
}

export interface ILogicalOperator {
  name: string;
}

export interface ICondition {
  operator: IComparisonOperator;
  field: IField;
  value: string;
}

export interface IMetadata {
  fields: Array<IField>;
};
