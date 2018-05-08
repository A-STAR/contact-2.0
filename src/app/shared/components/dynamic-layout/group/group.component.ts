import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  DynamicLayoutGroupType,
  DynamicLayoutHorizontalGroupMode,
  DynamicLayoutVerticalGroupMode,
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

  get hasSplitters(): boolean {
    const { group } = this;
    const h = group.groupType === DynamicLayoutGroupType.HORIZONTAL && group.mode === DynamicLayoutHorizontalGroupMode.SPLITTERS;
    const v = group.groupType === DynamicLayoutGroupType.VERTICAL && group.mode === DynamicLayoutVerticalGroupMode.SPLITTERS;
    return h || v;
  }

  get groupClass(): Record<string, boolean> {
    const { group } = this;
    const isHorizontal = group.groupType === DynamicLayoutGroupType.HORIZONTAL;
    const isVertical = group.groupType === DynamicLayoutGroupType.VERTICAL;
    const isLine = group.groupType === DynamicLayoutGroupType.VERTICAL && group.mode === DynamicLayoutVerticalGroupMode.LINE;
    return {
      'grow': isHorizontal || !isLine,
      'flex': isHorizontal || isVertical,
      'vertical': isVertical,
      'horizontal horizontal-group': isHorizontal,
      'auto-height': isLine,
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

  isSplitVisible(item: IDynamicLayoutItem): Observable<boolean> {
    return item.displaySplit ? item.displaySplit : of(true);
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
