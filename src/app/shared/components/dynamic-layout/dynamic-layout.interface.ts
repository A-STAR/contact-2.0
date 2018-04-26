import { Observable } from 'rxjs/Observable';

import { IDynamicLayoutAttribute } from './attribute/attribute.interface';
import { IDynamicLayoutControl } from './control/control.interface';
import { IDynamicLayoutGroup } from './group/group.interface';
import { IDynamicLayoutTemplate } from './template/template.interface';

export * from './attribute/attribute.interface';
export * from './context.interface';
export * from './control/control.interface';
export * from './group/group.interface';
export * from './item.interface';
export * from './template/template.interface';

export type IDynamicLayoutItem =
  | IDynamicLayoutGroup
  | IDynamicLayoutControl
  | IDynamicLayoutTemplate
  | IDynamicLayoutAttribute
;

export interface IDynamicLayoutConfig {
  items: IDynamicLayoutItem[];
}

export interface IDynamicLayoutItemProperties {
  item: IDynamicLayoutItem;
  streams: {
    disabled: Observable<boolean>;
    display: Observable<boolean>;
  };
}
