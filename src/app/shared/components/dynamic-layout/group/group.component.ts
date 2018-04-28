import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutGroup,
  IDynamicLayoutItem,
} from '../dynamic-layout.interface';

import { DynamicLayoutService } from '../dynamic-layout.service';
import { GroupService } from './group.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-dynamic-layout-group',
  templateUrl: 'group.component.html'
})
export class GroupComponent implements OnInit {
  @Input() group: IDynamicLayoutGroup;

  private sizes: number[];

  constructor(
    private groupService: GroupService,
    private layoutService: DynamicLayoutService,
  ) {}

  get groupClass(): string {
    return this.group.groupType === DynamicLayoutGroupType.VERTICAL
      ? 'flex vertical'
      : 'flex horizontal';
  }

  get splitDirection(): string {
    return this.group.groupType === DynamicLayoutGroupType.VERTICAL
      ? 'vertical'
      : 'horizontal';
  }

  ngOnInit(): void {
    this.sizes = this.groupService.getSplittersConfig(this.layoutService.key, this.group.uid);
  }

  isDisplayed(item: IDynamicLayoutItem): Observable<boolean> {
    return this.layoutService.getItem(item.uid).streams.display;
  }

  getAreaSize(item: IDynamicLayoutItem, i: number): number {
    return this.sizes
      ? this.sizes[i]
      : this.getItemSize(item);
  }

  getItemStyle(item: IDynamicLayoutItem): Partial<CSSStyleDeclaration> {
    return [ DynamicLayoutItemType.ATTRIBUTE, DynamicLayoutItemType.CONTROL ].includes(item.type)
      ? {}
      : { flex: `${this.getItemSize(item)} 0` };
  }

  getItemSize(item: IDynamicLayoutItem): number {
    return item.size || (100 / this.group.children.length);
  }

  onDragEnd(event: any): void {
    this.groupService.setSplittersConfig(this.layoutService.key, this.group.uid, event.sizes);
  }
}
