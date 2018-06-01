import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { share } from 'rxjs/operators/share';

import {
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutGroup,
  IDynamicLayoutItem,
  IDynamicLayoutItemProperties,
  IDynamicLayoutPlugin,
} from './dynamic-layout.interface';

import { AttributeService } from './attribute/attribute.service';
import { ContextService } from '@app/core/context/context.service';
import { ControlService } from './control/control.service';
import { MetadataService } from './metadata.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DynamicLayoutService {
  private _group: IDynamicLayoutGroup;
  private _items: Record<string, IDynamicLayoutItemProperties<IDynamicLayoutItem>>;
  private _key: string;
  private _plugins: IDynamicLayoutPlugin[];

  readonly ready$ = new BehaviorSubject<boolean>(false);

  constructor(
    private attributeService: AttributeService,
    private contextService: ContextService,
    private formService: ControlService,
    private metadataService: MetadataService,
  ) { }

  get key(): string {
    return this._key;
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
      groupType: DynamicLayoutGroupType.VERTICAL,
      size: 100,
      type: DynamicLayoutItemType.GROUP,
    };
    this._key = key || config.key;
    this._items = this.flattenItems(items);
    this._plugins = config.plugins || [];
    this.attributeService.init(this._items);
    this.formService.init(this._items, this._plugins, this._key);
    this.ready$.next(true);
    // TODO(i.lobanov): strange behaviour, investigate
    // this.ready$.complete();
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
        display: this.calculate(item, 'display'),
        enabled: this.calculate(item, 'enabled'),
        validators: Object.keys(validators).reduce((acc, key) => ({ ...acc, [key]: this.calculate(validators, key) }), {}),
      },
    };
  }

  private calculate(item: any, prop: string): Observable<any> {
    if (item[prop] == null) {
      return of(true);
    }
    return typeof item[prop] === 'object'
      ? this.contextService.calculate(item[prop]).pipe(share())
      : of(item[prop]);
  }
}
