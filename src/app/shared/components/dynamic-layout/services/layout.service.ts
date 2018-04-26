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
import { MetadataService } from './metadata.service';

@Injectable()
export class LayoutService {
  private _group: IDynamicLayoutGroup;
  private _items: { [key: string]: IDynamicLayoutItemProperties };
  private _initialized = false;

  constructor(
    private attributeService: AttributeService,
    private contextService: ContextService,
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

  private init(config: IDynamicLayoutConfig): void {
    const items = this.addUids(config.items);
    this._group = {
      children: items,
      groupType: DynamicLayoutGroupType.PLAIN,
      type: DynamicLayoutItemType.GROUP,
    };
    this._items = this.flattenItems(items);
    this.attributeService.getAttributes(this._items);
    this._initialized = true;

    // tslint:disable-next-line:no-console
    console.log(this._group);
    // tslint:disable-next-line:no-console
    console.log(this._items);
  }

  private addUids(items: IDynamicLayoutItem[], level: number = 0): IDynamicLayoutItem[] {
    return items.map((item, i) => {
      const uid = `${level}.${i}`;
      switch (item.type) {
        case DynamicLayoutItemType.GROUP:
          return { ...item, uid, children: this.addUids(item.children, level + 1) };
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
        display: item.display ? this.contextService.calculate(item.display) : of(true),
      },
    };
  }
}
