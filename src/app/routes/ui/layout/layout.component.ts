import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ContextOperator,
  DynamicLayoutControlType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  DynamicLayoutGroupType,
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
        groupType: DynamicLayoutGroupType.HORIZONTAL,
        children: [
          {
            type: DynamicLayoutItemType.CONTROL,
            controlType: DynamicLayoutControlType.TEXT,
            label: 'Foo',
            name: 'foo',
          },
          {
            type: DynamicLayoutItemType.GROUP,
            children: [
              {
                type: DynamicLayoutItemType.CONTROL,
                controlType: DynamicLayoutControlType.TEXT,
                form: 'custom',
                label: 'Text Control',
                name: 'text',
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
                key: 'ctx.debt.id',
                formula: 1,
              },
              {
                type: DynamicLayoutItemType.GROUP,
                groupType: DynamicLayoutGroupType.TABS,
                children: [
                  {
                    type: DynamicLayoutItemType.CONTROL,
                    controlType: DynamicLayoutControlType.TEXT,
                    label: 'Bar',
                    name: 'bar',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
