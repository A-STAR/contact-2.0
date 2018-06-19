import { DynamicLayoutItemType, IDynamicLayoutGenericItem } from '../dynamic-layout.interface';

export interface IDynamicLayoutCustomOperation extends IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType.CUSTOM_OPERATION;
  id: number;
  // Optional:
  label?: string;
  params?: {
    [key: string]: any;
  };
}
