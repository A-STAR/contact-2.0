export enum IAccessConfigItemType {
  CONSTANT = 'constant',
  ENTITY = 'entity',
  PERMISSION = 'permission',
}

export enum IAccessByEntityMethod {
  IS_USED = 'isUsed',
  IS_MANDATORY = 'isMandatory',
}

export interface IAccessByEntityConfigItem {
  type: IAccessConfigItemType.ENTITY;
  method: IAccessByEntityMethod;
}

export enum IAccessByValueBagMethod {
  HAS = 'has',
  CONTAINS = 'contains',
  NOT_EMPTY = 'notEmpty',
}

export interface IAccessByValueBagConfigItem {
  type: IAccessConfigItemType.CONSTANT | IAccessConfigItemType.PERMISSION;
  method: IAccessByValueBagMethod;
}

export type IAccessConfigItem = IAccessByEntityConfigItem | IAccessByValueBagConfigItem;

export enum IAccessConfigOperator {
  AND = 'and',
  OR = 'or',
}

export interface IAccessConfig {
  operator: IAccessConfigOperator;
  children: IAccessConfig | IAccessConfigItem;
}
