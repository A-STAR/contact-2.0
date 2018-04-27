import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutGroup,
  IDynamicLayoutItem,
  IDynamicLayoutItemProperties,
} from './dynamic-layout.interface';

import { AttributeService } from './attribute/attribute.service';
import { ContextService } from './context.service';
import { FormService } from './control/form.service';
import { MetadataService } from './metadata.service';

@Injectable()
export class LayoutService {
  private _group: IDynamicLayoutGroup;
  private _items: Record<string, IDynamicLayoutItemProperties<IDynamicLayoutItem>>;
  private _initialized = false;
  private _key: string;

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

  get items(): Record<string, IDynamicLayoutItemProperties<IDynamicLayoutItem>> {
    return this._items;
  }

  init(layout: string | IDynamicLayoutConfig): void {
    if (typeof layout === 'string') {
      this.metadataService
        .getConfig(layout)
        .subscribe(config => this.onInit(config, layout));
    } else {
      this.onInit(layout);
    }
  }

  getItem(uid: string): IDynamicLayoutItemProperties<IDynamicLayoutItem> {
    return this._items[uid];
  }

  private onInit(config: IDynamicLayoutConfig, key: string = null): void {
    const items = this.addUids(config.items);
    this._group = {
      children: items,
      groupType: DynamicLayoutGroupType.PLAIN,
      type: DynamicLayoutItemType.GROUP,
    };
    this._key = key || config.key;
    this._items = this.flattenItems(items);
    this.attributeService.init(this._items);
    this.formService.init(this._items, this._key);
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

  private flattenItems(items: IDynamicLayoutItem[]): { [key: string]: IDynamicLayoutItemProperties<IDynamicLayoutItem> } {
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

  private createItemProperties(item: IDynamicLayoutItem): IDynamicLayoutItemProperties<IDynamicLayoutItem> {
    const validators = item.validators || {};
    return {
      item,
      streams: {
        disabled: this.calculate(item, 'disabled'),
        display: this.calculate(item, 'display'),
        validators: Object.keys(validators).reduce((acc, key) => ({ ...acc, [key]: this.calculate(validators, key) }), {}),
      },
    };
  }

  private calculate(item: any, prop: string): Observable<any> {
    return item[prop] ? this.contextService.calculate(item[prop]) : of(true);
  }
}
