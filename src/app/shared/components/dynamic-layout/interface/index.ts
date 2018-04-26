import { Observable } from 'rxjs/Observable';

import { IDynamicLayoutAttribute } from './attribute.interface';
import { IDynamicLayoutControl } from './control.interface';
import { IDynamicLayoutGroup } from './group.interface';
import { IDynamicLayoutTemplate } from './template.interface';

export * from './attribute.interface';
export * from './context.interface';
export * from './control.interface';
export * from './group.interface';
export * from './item.interface';
export * from './template.interface';

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
    display: Observable<boolean>;
  };
}
