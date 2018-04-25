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

import { ContextService } from './context.service';
import { MetadataService } from './metadata.service';

@Injectable()
export class LayoutService {
  private config: IDynamicLayoutConfig;
  private _items: IDynamicLayoutItemProperties[];

  constructor(
    private contextService: ContextService,
    private metadataService: MetadataService,
  ) {}

  get initialized(): boolean {
    return Boolean(this.config);
  }

  get items(): IDynamicLayoutItemProperties[] {
    return this._items;
  }

  get group(): IDynamicLayoutGroup {
    return {
      children: this.config.items,
      groupType: DynamicLayoutGroupType.PLAIN,
      type: DynamicLayoutItemType.GROUP,
    };
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
    this._items = this.flattenItems(config.items);
    this._items.forEach(item => {
      item.streams.display.subscribe(r => {
        // tslint:disable-next-line:no-console
        console.log(item);
        // tslint:disable-next-line:no-console
        console.log(r);
      });
    });
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
