import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  DynamicLayoutControlType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  readonly layout: IDynamicLayoutConfig = {
    items: [
      {
        type: DynamicLayoutItemType.GROUP,
        children: [
          {
            type: DynamicLayoutItemType.CONTROL,
            controlType: DynamicLayoutControlType.TEXT,
          },
        ],
      },
    ],
  };
}
