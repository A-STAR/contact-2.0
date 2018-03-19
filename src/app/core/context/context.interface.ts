export enum IContextConfigItemType {
  CONSTANT = 'constant',
  ENTITY = 'entity',
  GROUP = 'group',
  PERMISSION = 'permission',
}

export enum IContextByEntityMethod {
  IS_USED = 'isUsed',
  IS_MANDATORY = 'isMandatory',
}

export interface IContextByEntityItem {
  type: IContextConfigItemType.ENTITY;
  method: IContextByEntityMethod;
  value: number;
}

export enum IContextByValueBagMethod {
  HAS = 'has',
  CONTAINS = 'contains',
  NOT_EMPTY = 'notEmpty',
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

export type IContextByValueBagConfigItem = IContextByValueBagItemWithPlainValue | IContextByValueBagItemWithArrayValue;

export type IContextConfigItem = IContextByEntityItem | IContextByValueBagConfigItem;

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
