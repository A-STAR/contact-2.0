import { ValueBag } from '@app/core/value-bag/value-bag';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';

export enum ContextOperator {

  // Unary
  CONSTANT_IS_TRUE     = 'constantIsTrue',
  CONSTANT_NOT_EMPTY   = 'constantNotEmpty',
  ENTITY_IS_MANDATORY  = 'entityIsMandatory',
  ENTITY_IS_USED       = 'entityIsUsed',
  EVAL                 = 'eval',
  NOT                  = 'not',
  NOT_NULL             = 'notNull',
  PERMISSION_IS_TRUE   = 'permissionIsTrue',
  PERMISSION_NOT_EMPTY = 'permissionNotEmpty',
  PERSON_ATTRIBUTES    = 'personAttributes',
  UI_STATE             = 'uiState',

  // Binary
  CONSTANT_CONTAINS   = 'constantContains',
  EQUALS              = 'equals',
  PERMISSION_CONTAINS = 'permissionContains',

  // Arbitrary arguments list length
  AND = 'and',
  OR  = 'or',
}

export type IContextUnaryOperator =
  | ContextOperator.CONSTANT_IS_TRUE
  | ContextOperator.CONSTANT_NOT_EMPTY
  | ContextOperator.ENTITY_IS_MANDATORY
  | ContextOperator.ENTITY_IS_USED
  | ContextOperator.NOT
  | ContextOperator.NOT_NULL
  | ContextOperator.PERMISSION_IS_TRUE
  | ContextOperator.PERMISSION_NOT_EMPTY
  | ContextOperator.PERSON_ATTRIBUTES
  | ContextOperator.UI_STATE
;

export type IContextBinaryOperator =
  | ContextOperator.CONSTANT_CONTAINS
  | ContextOperator.EQUALS
  | ContextOperator.PERMISSION_CONTAINS
;

export type IContextVariadicOperator =
  | ContextOperator.AND
  | ContextOperator.OR
;

export interface IContextGenericExpression {
  operator: ContextOperator;
}

export interface IContextEvalExpression extends IContextGenericExpression {
  operator: ContextOperator.EVAL;
  value: string;
}

export interface IContextUnaryExpression extends IContextGenericExpression {
  operator: IContextUnaryOperator;
  value: IContext;
}

export interface IContextBinaryExpression extends IContextGenericExpression {
  operator: IContextBinaryOperator;
  value: [ IContext, IContext ];
}

export interface IContextVariadicExpression extends IContextGenericExpression {
  operator: IContextVariadicOperator;
  value: IContext[];
}

export type IContextExpression =
  | IContextEvalExpression
  | IContextUnaryExpression
  | IContextBinaryExpression
  | IContextVariadicExpression
;

export type IContextPrimitive = boolean | number | string;

export type IContext = IContextPrimitive | IContextExpression;

export interface IAppContext {
  attributes: IEntityAttributes;
  constants: ValueBag;
  permissions: ValueBag;
  state: any;
}
