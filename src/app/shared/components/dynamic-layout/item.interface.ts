import { IContext } from './context.interface';

export enum DynamicLayoutItemType {

  /**
   * Form control, such as text input, textarea, checkbox, etc.
   */
  CONTROL = 'control',

  /**
   * Readonly attributes for dynamic form model
   * See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=176259099#id-Конфигурацияформ-Параметры
   */
  ATTRIBUTE = 'attribute',

  /**
   * Groups that contain other controls, fields, groups and templates
   */
  GROUP = 'group',

  /**
   * References to Angular templates that can be inserted into dynamic layout
   */
  TEMPLATE = 'template',
}

export interface IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType;
  // Optional:
  disabled?: IContext;
  display?: IContext;
  label?: string;
  uid?: string;
  validators?: Record<string, IContext>;
}
