export enum IContextConfigItemType {
  CONSTANT = 'constant',
  ENTITY = 'entity',
  GROUP = 'group',
  PERMISSION = 'permission',
  STATE = 'state,'
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

export interface IContextByValueBagItemWithAnyValue {
  type: IContextConfigItemType.CONSTANT | IContextConfigItemType.PERMISSION;
  method: IContextByValueBagMethod.VALUE;
  value: string;
}

export interface IContextByValueBagItemWithPlainValue {
  type: IContextConfigItemType.CONSTANT | IContextConfigItemType.PERMISSION;
  method: IContextByValueBagMethod.HAS | IContextByValueBagMethod.NOT_EMPTY;
  value: string;
}

export interface IContextByValueBagItemWithArrayValue {
  type: IContextConfigItemType.CONSTANT | IContextConfigItemType.PERMISSION;
  method: IContextByValueBagMethod.CONTAINS;
  value: [string, number];
}

export type IContextByValueBagConfigItem =
  IContextByValueBagItemWithPlainValue |
  IContextByValueBagItemWithArrayValue |
  IContextByValueBagItemWithAnyValue;


// State:

export enum IContextByStateMethod {
  NOT_EMPTY = 'notEmpty',
  EQUALS = 'equals',
}

export interface IContextByStateUnaryItem {
  type: IContextConfigItemType.STATE;
  method: IContextByStateMethod.NOT_EMPTY;
  key: string;
}

export interface IContextByStateBinaryItem {
  type: IContextConfigItemType.STATE;
  method: IContextByStateMethod.EQUALS;
  key: string;
  value: any;
}

export type IContextByStateItem = IContextByStateUnaryItem | IContextByStateBinaryItem;

export type IContextConfigItem = IContextByEntityItem | IContextByValueBagConfigItem | IContextByStateItem;


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

export type IContextConfig = IContextGroup | IContextConfigItem;
