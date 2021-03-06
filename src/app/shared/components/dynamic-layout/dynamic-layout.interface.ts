import { Observable } from 'rxjs/Observable';

import { IContext } from '@app/core/context/context.interface';
import { IDynamicLayoutAttribute } from './attribute/attribute.interface';
import { IDynamicLayoutControl } from './control/control.interface';
import { IDynamicLayoutCustomOperation } from './custom-operation/custom-operation.interface';
import { IDynamicLayoutGroup } from './group/group.interface';
import { IDynamicLayoutPlugin } from './event/event.interface';
import { IDynamicLayoutTemplate } from './template/template.interface';

export * from './attribute/attribute.interface';
export * from './control/control.interface';
export * from './event/event.interface';
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

  /**
   * Renders custom operation input form
   */
  CUSTOM_OPERATION = 'customOperation'
}

export interface IDynamicLayoutGenericItem {
  type: DynamicLayoutItemType;
  // Optional:
  display?: IContext;
  displaySplit?: Observable<boolean>;
  enabled?: IContext;
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
  | IDynamicLayoutCustomOperation
;

export interface IDynamicLayoutConfig {
  items: IDynamicLayoutItem[];
  // Optional
  key?: string;
  plugins?: IDynamicLayoutPlugin[];
}

export interface IDynamicLayoutItemProperties<T> {
  item: T;
  streams: {
    display: Observable<boolean>;
    enabled: Observable<boolean>;
    validators: Record<string, Observable<any>>;
  };
}

export interface IDynamicLayoutState {
  [key: string]: {
    forms: {
      [key: string]: {
        dirty: boolean;
        status: string;
        value: Record<string, any>;
      };
    };
    config: IDynamicLayoutConfig
  };
}

export enum DynamicLayoutAction {
  FETCH_CONFIG = '[layout] fetch config',
  FETCH_CONFIG_SUCCESS = '[layout] fetch config success',
}

export interface IDynamicLayoutGenericAction {
  type: DynamicLayoutAction;
}

export interface IDynamicLayoutFetchConfigAction extends IDynamicLayoutGenericAction {
  type: DynamicLayoutAction.FETCH_CONFIG;
  payload: {
    key: string;
  };
}

export interface IDynamicLayoutFetchConfigSuccessAction extends IDynamicLayoutGenericAction {
  type: DynamicLayoutAction.FETCH_CONFIG_SUCCESS;
  payload: {
    key: string;
    config: IDynamicLayoutConfig
  };
}

export type IDynamicLayoutAction =
  | IDynamicLayoutFetchConfigSuccessAction
;
