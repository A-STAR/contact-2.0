import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AreaLayout } from '@app/shared/components/layout/area/area.interface';
import { IDynamicLayoutGroup, IDynamicLayoutItem, DynamicLayoutGroupType, DynamicLayoutItemType } from '../dynamic-layout.interface';

import { LayoutService } from '../dynamic-layout.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-dynamic-layout-group',
  templateUrl: 'group.component.html'
})
export class GroupComponent {
  @Input() group: IDynamicLayoutGroup;

  constructor(
    private layoutService: LayoutService,
  ) {}

  isDisplayed(item: IDynamicLayoutItem): Observable<boolean> {
    return this.layoutService.getItem(item.uid).streams.display;
  }

  get groupClass(): string {
    return this.group.groupType === DynamicLayoutGroupType.VERTICAL
      ? 'flex vertical'
      : 'flex horizontal';
  }

  get areaLayout(): string {
    return this.group.groupType === DynamicLayoutGroupType.VERTICAL
      ? AreaLayout.COLUMN
      : AreaLayout.ROW;
  }

  getItemStyle(item: IDynamicLayoutItem): Partial<CSSStyleDeclaration> {
    if ([ DynamicLayoutItemType.ATTRIBUTE, DynamicLayoutItemType.CONTROL ].includes(item.type)) {
      return {};
    } else {
      const size = this.getItemSize(item);
      return {
        flex: `${size} 0`,
      };
    }
  }

  getItemSize(item: IDynamicLayoutItem): number {
    return item.size || 1;
  }
}
