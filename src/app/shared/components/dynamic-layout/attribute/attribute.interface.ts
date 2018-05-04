import { IDynamicLayoutGenericItem, DynamicLayoutItemType } from '../dynamic-layout.interface';

export interface IAttributeContext {
  debtId: number;
  personId: number;
  personRole: number;
  userId: number;
}

export interface IAttributePayload {
  attributes: Record<string, number>;
  context: Partial<IAttributeContext>;
}

export interface IDynamicLayoutAttribute extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.ATTRIBUTE;
  key: string;
  formula: number;
}
