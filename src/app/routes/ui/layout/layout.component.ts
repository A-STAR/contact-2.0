import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  AttributeType,
  ContextOperator,
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
            display: {
              operator: ContextOperator.AND,
              value: [
                {
                  operator: ContextOperator.EVAL,
                  value: 'userPermissions.permissions.CONST_VALUE_VIEW.valueB',
                },
                {
                  operator: ContextOperator.EVAL,
                  value: 'userPermissions.permissions.CONST_VALUE_EDIT.valueB',
                },
              ],
            },
          },
          {
            type: DynamicLayoutItemType.ATTRIBUTE,
            attributeType: AttributeType.FORMULA,
            value: 'ctx.debt.id',
          }
        ],
      },
    ],
  };
}
