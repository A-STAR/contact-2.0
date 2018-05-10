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
import { combineLatestAnd } from '@app/core/utils';

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
    return {
      'grow flex': true,
      'vertical': isVertical,
      'horizontal horizontal-group': isHorizontal,
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
    const displaySplit = item.displaySplit
      ? item.displaySplit
      : of(true);
    // TODO(i.lobanov): create this stream once at init stage
    return combineLatestAnd([
      this.layoutService.getItem(item.uid).streams.display,
      displaySplit,
    ]);
  }

  isDisplayed(item: IDynamicLayoutItem): Observable<boolean> {
    return this.layoutService.getItem(item.uid).streams.display;
  }

  getAreaSize(item: IDynamicLayoutItem, i: number): number {
    return this.sizes
      ? this.sizes[i]
      : item.size || (100 / this.group.children.length);
  }

  getItemStyle(item: IDynamicLayoutItem): Partial<CSSStyleDeclaration> {
    return {
      flex: item.size ? `${item.size} 0` : `0 0 auto`,
    };
  }

  onDragEnd(event: any): void {
    this.groupService.setSplittersConfig(this.layoutService.key, this.group.uid, event.sizes);
  }
}
