export interface IGroup {
  parent?: IGroup;
  operator: string;
  rules: Array<IGroup | ICondition>;
}

export interface IField {
  name: string;
}

export interface IOperator {
  name: string;
}

export interface ICondition {
  condition: string;
  field: string;
  data: string;
}
