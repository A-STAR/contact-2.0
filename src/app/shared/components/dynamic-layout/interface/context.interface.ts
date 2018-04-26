export enum ContextOperator {

  // Unary
  EVAL  = 'eval',
  NOT   = 'not',
  ROUTE = 'route',

  // Binary
  CONTAINS = 'contains',
  EQUALS   = 'equals',

  // Arbitrary arguments list length
  AND = 'and',
  OR  = 'or',

  // Metaoperators
  ATTRIBUTE         = 'attribute',
  CONSTANT          = 'constant',
  PERMISSION        = 'permission',
  PERSON_ATTRIBUTES = 'personAttributes',
}

export interface IContextExpression {
  operator: ContextOperator;
  value: IContext | IContext[];
}

export type IContextPrimitive = boolean | number | string;

export type IContext = IContextPrimitive | IContextExpression;
