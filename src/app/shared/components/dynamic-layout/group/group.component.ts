import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  DynamicLayoutGroupType,
  IDynamicLayoutGroup,
  IDynamicLayoutItem,
} from '../dynamic-layout.interface';

import { DynamicLayoutService } from '../dynamic-layout.service';
import { GroupService } from './group.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-dynamic-layout-group',
  styleUrls: [ './group.component.scss' ],
  templateUrl: './group.component.html'
})
export class GroupComponent implements OnInit {
  @Input() group: IDynamicLayoutGroup;

  private sizes: number[];

  constructor(
    private groupService: GroupService,
    private layoutService: DynamicLayoutService,
  ) {}

  get groupClass(): Record<string, boolean> {
    return {
      'grow': this.group.grow,
      'flex vertical': this.group.groupType === DynamicLayoutGroupType.VERTICAL,
      'flex horizontal horizontal-group': this.group.groupType === DynamicLayoutGroupType.HORIZONTAL,
    };
  }

  get splitDirection(): string {
    return this.group.groupType === DynamicLayoutGroupType.VERTICAL
      ? 'vertical'
      : 'horizontal';
  }

  get itemClass(): string {
    return this.group.groupType === DynamicLayoutGroupType.HORIZONTAL
      ? 'horizontal-group-item'
      : null;
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
    return {
      flex: `${this.getItemSize(item)} 0`,
    };
  }

  getItemSize(item: IDynamicLayoutItem): number {
    return item.size || (100 / this.group.children.length);
  }

  onDragEnd(event: any): void {
    this.groupService.setSplittersConfig(this.layoutService.key, this.group.uid, event.sizes);
  }
}