import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicLayoutGroup, IDynamicLayoutItem } from '../../interface';

import { LayoutService } from '../../services/layout.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
