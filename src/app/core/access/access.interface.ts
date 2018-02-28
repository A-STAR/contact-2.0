export enum IAccessConfigItemType {
  CONSTANT = 'constant',
  ENTITY = 'entity',
  GROUP = 'group',
  PERMISSION = 'permission',
}

export enum IAccessByEntityMethod {
  IS_USED = 'isUsed',
  IS_MANDATORY = 'isMandatory',
}

export interface IAccessByEntityItem {
  type: IAccessConfigItemType.ENTITY;
  method: IAccessByEntityMethod;
  value: number;
}

export enum IAccessByValueBagMethod {
  HAS = 'has',
  CONTAINS = 'contains',
  NOT_EMPTY = 'notEmpty',
}

export interface IAccessByValueBagItemWithPlainValue {
  type: IAccessConfigItemType.CONSTANT | IAccessConfigItemType.PERMISSION;
  method: IAccessByValueBagMethod.HAS | IAccessByValueBagMethod.NOT_EMPTY;
  value: string;
}

export interface IAccessByValueBagItemWithArrayValue {
  type: IAccessConfigItemType.CONSTANT | IAccessConfigItemType.PERMISSION;
  method: IAccessByValueBagMethod.CONTAINS;
  value: [string, number];
}

export type IAccessByValueBagConfigItem = IAccessByValueBagItemWithPlainValue | IAccessByValueBagItemWithArrayValue;

export type IAccessConfigItem = IAccessByEntityItem | IAccessByValueBagConfigItem;

export enum IAccessConfigOperator {
  AND = 'and',
  OR = 'or',
}

export interface IAccessGroup {
  type: IAccessConfigItemType.GROUP;
  operator: IAccessConfigOperator;
  children: IAccessConfig[];
}

export type IAccessConfig = IAccessGroup | IAccessConfigItem;
