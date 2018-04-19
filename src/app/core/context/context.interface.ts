export enum IContextConfigItemType {
  CONSTANT = 'constant',
  ENTITY = 'entity',
  EXPRESSION = 'expression',
  GROUP = 'group',
  PERMISSION = 'permission',
  STATE = 'state',
}


// Entity:

export enum IContextByEntityMethod {
  IS_USED = 'isUsed',
  IS_MANDATORY = 'isMandatory',
}

export interface IContextByEntityItem {
  type: IContextConfigItemType.ENTITY;
  method: IContextByEntityMethod;
  value: number;
}


// Value Bag:

export enum IContextByValueBagMethod {
  HAS = 'has',
  CONTAINS = 'contains',
  NOT_EMPTY = 'notEmpty',
  VALUE = 'value',
}

export interface IContextByValueBagUnaryOperation {
  type: IContextConfigItemType.CONSTANT | IContextConfigItemType.PERMISSION;
  method: IContextByValueBagMethod.HAS | IContextByValueBagMethod.NOT_EMPTY | IContextByValueBagMethod.VALUE;
  value: string;
}

export interface IContextByValueBagBinaryOperation {
  type: IContextConfigItemType.CONSTANT | IContextConfigItemType.PERMISSION;
  method: IContextByValueBagMethod.CONTAINS;
  name: string;
  value: number;
}

export type IContextByValueBagConfigItem = IContextByValueBagUnaryOperation | IContextByValueBagBinaryOperation;


// State:

export enum IContextByStateMethod {
  NOT_EMPTY = 'notEmpty',
  EQUALS = 'equals',
  VALUE = 'value',
}

export interface IContextByStateUnaryItem {
  type: IContextConfigItemType.STATE;
  method: IContextByStateMethod.NOT_EMPTY | IContextByStateMethod.VALUE;
  key: string;
}

export interface IContextByStateBinaryItem {
  type: IContextConfigItemType.STATE;
  method: IContextByStateMethod.EQUALS;
  key: string;
  value: any;
}

export type IContextByStateItem = IContextByStateUnaryItem | IContextByStateBinaryItem;


// Expression:

export enum IContextByExpressionMethod {
  SWITCH = 'switch',
}

export interface IContextByExpressionSwitchItem {
  type: IContextConfigItemType.EXPRESSION;
  method: IContextByExpressionMethod.SWITCH;
  key: IContextConfig;
  value: { [key: string]: string };
}

export type IContextByExpressionItem = IContextByExpressionSwitchItem;


// Group:

export enum IContextConfigOperator {
  AND = 'and',
  OR = 'or',
}

export interface IContextGroup {
  type: IContextConfigItemType.GROUP;
  operator: IContextConfigOperator;
  children: IContextConfig[];
}

// tslint:disable-next-line:max-line-length
export type IContextConfigItem = IContextByEntityItem | IContextByValueBagConfigItem | IContextByStateItem | IContextByExpressionItem;

export type IContextConfig = IContextGroup | IContextConfigItem;
