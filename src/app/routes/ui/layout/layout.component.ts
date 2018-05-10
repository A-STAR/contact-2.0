import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  ContextOperator,
  DynamicLayoutControlType,
  DynamicLayoutGroupMode,
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  @ViewChild('foo', { read: TemplateRef }) foo: TemplateRef<any>;

  readonly data = {
    default: {
      foo: 'Foo',
      bar: 'Bar',
    },
    custom: {
      text: 'Text',
    },
  };

  readonly layout: IDynamicLayoutConfig = {
    key: 'routes/ui/layout',
    items: [
      {
        type: DynamicLayoutItemType.GROUP,
        groupType: DynamicLayoutGroupType.HORIZONTAL,
        mode: DynamicLayoutGroupMode.SPLITTERS,
        size: 100,
        children: [
          {
            type: DynamicLayoutItemType.TEMPLATE,
            value: 'foo',
            size: 25,
          },
          {
            type: DynamicLayoutItemType.CONTROL,
            controlType: DynamicLayoutControlType.TEXT,
            label: 'Foo',
            name: 'foo',
            size: 25,
          },
          {
            type: DynamicLayoutItemType.GROUP,
            groupType: DynamicLayoutGroupType.VERTICAL,
            mode: DynamicLayoutGroupMode.SPLITTERS,
            size: 50,
            children: [
              {
                type: DynamicLayoutItemType.GROUP,
                groupType: DynamicLayoutGroupType.VERTICAL,
                collapsible: true,
                size: 1,
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
                ]
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
              {
                type: DynamicLayoutItemType.TEMPLATE,
                value: 'foo',
                size: 1,
              },
            ],
          },
        ],
      },
    ],
  };

  templates: Record<string, TemplateRef<any>>;

  ngOnInit(): void {
    this.templates = {
      foo: this.foo,
    };
  }
}
