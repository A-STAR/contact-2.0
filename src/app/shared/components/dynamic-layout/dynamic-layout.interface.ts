import { Observable } from 'rxjs/Observable';

import { IContext } from './context.interface';
import { IDynamicLayoutAttribute } from './attribute/attribute.interface';
import { IDynamicLayoutControl } from './control/control.interface';
import { IDynamicLayoutGroup } from './group/group.interface';
import { IDynamicLayoutTemplate } from './template/template.interface';

export * from './attribute/attribute.interface';
export * from './context.interface';
export * from './control/control.interface';
export * from './group/group.interface';
export * from './template/template.interface';

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
  size?: number;
  uid?: string;
  validators?: Record<string, IContext>;
}

export type IDynamicLayoutItem =
  | IDynamicLayoutGroup
  | IDynamicLayoutControl
  | IDynamicLayoutTemplate
  | IDynamicLayoutAttribute
;

export interface IDynamicLayoutConfig {
  items: IDynamicLayoutItem[];
  // Optional
  key?: string;
}

export interface IDynamicLayoutItemProperties<T> {
  item: T;
  streams: {
    disabled: Observable<boolean>;
    display: Observable<boolean>;
    validators: Record<string, Observable<any>>;
  };
}
