import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';

import {
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutGroup,
  IDynamicLayoutItem,
  IDynamicLayoutItemProperties,
} from '../interface';

import { AttributeService } from './attribute.service';
import { ContextService } from './context.service';
import { FormService } from './form.service';
import { MetadataService } from './metadata.service';

@Injectable()
export class LayoutService {
  private _group: IDynamicLayoutGroup;
  private _items: { [key: string]: IDynamicLayoutItemProperties };
  private _initialized = false;

  constructor(
    private attributeService: AttributeService,
    private contextService: ContextService,
    private formService: FormService,
    private metadataService: MetadataService,
  ) {}

  get initialized(): boolean {
    return this._initialized;
  }

  get group(): IDynamicLayoutGroup {
    return this._group;
  }

  get items(): { [key: string]: IDynamicLayoutItemProperties } {
    return this._items;
  }

  set layout(layout: string | IDynamicLayoutConfig) {
    if (typeof layout === 'string') {
      this.metadataService
        .getConfig(layout)
        .subscribe(config => this.init(config));
    } else {
      this.init(layout);
    }
  }

  getItem(uid: string): IDynamicLayoutItemProperties {
    return this._items[uid];
  }

  private init(config: IDynamicLayoutConfig): void {
    const items = this.addUids(config.items);
    this._group = {
      children: items,
      groupType: DynamicLayoutGroupType.PLAIN,
      type: DynamicLayoutItemType.GROUP,
    };
    this._items = this.flattenItems(items);
    this.attributeService.init(this._items);
    this.formService.init(this._items);
    this._initialized = true;
  }

  private addUids(items: IDynamicLayoutItem[], parent: string = null): IDynamicLayoutItem[] {
    return items.map((item, i) => {
      const uid = parent
        ? `${parent}.${i + 1}`
        : `${i + 1}`;
      switch (item.type) {
        case DynamicLayoutItemType.GROUP:
          return { ...item, uid, children: this.addUids(item.children, uid) };
        default:
          return { ...item, uid };
      }
    });
  }

  private flattenItems(items: IDynamicLayoutItem[]): { [key: string]: IDynamicLayoutItemProperties } {
    return items.reduce((acc, item) => {
      const properties = this.createItemProperties(item);
      switch (item.type) {
        case DynamicLayoutItemType.GROUP:
          return { ...acc, [item.uid]: properties, ...this.flattenItems(item.children) };
        default:
          return { ...acc, [item.uid]: properties };
      }
    }, {});
  }

  private createItemProperties(item: IDynamicLayoutItem): IDynamicLayoutItemProperties {
    return {
      item,
      streams: {
        disabled: item.disabled ? this.contextService.calculate(item.disabled) : of(true),
        display: item.display ? this.contextService.calculate(item.display) : of(true),
      },
    };
  }
}
