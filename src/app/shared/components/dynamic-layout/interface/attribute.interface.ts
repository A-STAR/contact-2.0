import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from './item.interface';

export interface IAttributeContext {
  debtId: number;
  personId: number;
  personRole: number;
  userId: number;
}

export enum AttributeType {
  FORMULA    = 'formula',
  FORMULA_ID = 'formulaId',
}

export interface IAttribute {
  type: AttributeType;
  value: string;
}

export interface IAttributeConfig {
  [key: string]: IAttribute[];
}

export interface IAttributePayload {
  attributes: IAttributeConfig;
  context: Partial<IAttributeContext>;
}

export interface IDynamicLayoutAttribute extends IDynamicLayoutGenericItem {
  attributeType: AttributeType;
  type: DynamicLayoutItemType.ATTRIBUTE;
  value: string;
  // Optional:
  dictCode?: number;
  lookupKey?: number;
}
