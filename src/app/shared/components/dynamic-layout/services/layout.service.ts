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
  private config: IDynamicLayoutConfig;
  private _group: IDynamicLayoutGroup;
  private _items: IDynamicLayoutItemProperties[];

  constructor(
    private attributeService: AttributeService,
    private contextService: ContextService,
    private metadataService: MetadataService,
  ) {}

  get initialized(): boolean {
    return Boolean(this.config);
  }

  get group(): IDynamicLayoutGroup {
    return this._group;
  }

  get items(): IDynamicLayoutItemProperties[] {
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
    this.config = config;
    this._group = {
      children: config.items,
      groupType: DynamicLayoutGroupType.PLAIN,
      type: DynamicLayoutItemType.GROUP,
    };
    this._items = this.flattenItems(config.items);
    this.attributeService.getAttributes(this._items);
    // this._items.forEach(item => {
    //   item.streams.display.subscribe(r => {
    //     // tslint:disable-next-line:no-console
    //     console.log(item);
    //     // tslint:disable-next-line:no-console
    //     console.log(r);
    //   });
    // });
  }

  private flattenItems(items: IDynamicLayoutItem[]): IDynamicLayoutItemProperties[] {
    return items.reduce((acc, item) => {
      switch (item.type) {
        case DynamicLayoutItemType.GROUP:
          return [ ...acc, ...this.flattenItems(item.children) ];
        default:
          return [ ...acc, this.createItemProperties(item) ];
      }
    }, []);
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
