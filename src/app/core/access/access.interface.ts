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

export interface IAccessByEntityConfigItem {
  type: IAccessConfigItemType.ENTITY;
  method: IAccessByEntityMethod;
  value: string[];
}

export enum IAccessByValueBagMethod {
  HAS = 'has',
  CONTAINS = 'contains',
  NOT_EMPTY = 'notEmpty',
}

export interface IAccessByValueBagConfigItem {
  type: IAccessConfigItemType.CONSTANT | IAccessConfigItemType.PERMISSION;
  method: IAccessByValueBagMethod;
  value: string[];
}

export type IAccessConfigItem = IAccessByEntityConfigItem | IAccessByValueBagConfigItem;

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
