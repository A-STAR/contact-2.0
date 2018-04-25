import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IDynamicLayoutGroup, IDynamicLayoutItem } from '../../interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-group',
  templateUrl: 'group.component.html'
})
export class GroupComponent {
  @Input() group: IDynamicLayoutGroup;

  get items(): IDynamicLayoutItem[] {
    return this.group.children;
  }
}
