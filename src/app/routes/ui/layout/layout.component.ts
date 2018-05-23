import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import {
  DynamicLayoutGroupMode,
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { IGridFilterType } from '@app/shared/components/grids/grids.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

interface IRow {
  id: number;
  foo: string;
  bar: string;
  dict: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  @ViewChild('foo', { read: TemplateRef }) foo: TemplateRef<any>;
  @ViewChild('actions', { read: TemplateRef }) actions: TemplateRef<any>;

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
            type: DynamicLayoutItemType.GROUP,
            groupType: DynamicLayoutGroupType.VERTICAL,
            size: 100,
            children: [
              {
                type: DynamicLayoutItemType.GROUP,
                groupType: DynamicLayoutGroupType.VERTICAL,
                label: 'Collapse Me!',
                collapsible: true,
                children: [
                  {
                    type: DynamicLayoutItemType.TEMPLATE,
                    value: 'actions',
                    context: {
                      label: 'Выполнить',
                      labelKey: 'label',
                      options: [
                        { value: 1, label: 'Операция 1' }
                      ],
                      actions: [{
                        action: 'customOperation',
                        params: [
                          'debtId'
                        ],
                        id: 1,
                        asyncMode: false,
                        outputConfig: {
                          key: 'operationOutput',
                          items: [{
                            type: 'template',
                            value: 'grid',
                            context: {
                              columns: [
                                { prop: 'column1', label: 'column1' },
                                { prop : 'column2', label: 'column2' }
                              ]
                            }
                          }]
                        }
                      }]
                    }
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #1',
                    formula: 1,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #2',
                    formula: 2,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #3',
                    formula: 3,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #4',
                    formula: 4,
                  },
                ]
              },
              {
                type: DynamicLayoutItemType.TEMPLATE,
                value: 'foo',
                size: 50,
              },
            ],
          },
          {
            type: DynamicLayoutItemType.GROUP,
            groupType: DynamicLayoutGroupType.VERTICAL,
            mode: DynamicLayoutGroupMode.SPLITTERS,
            size: 100,
            children: [
              {
                type: DynamicLayoutItemType.GROUP,
                groupType: DynamicLayoutGroupType.VERTICAL,
                children: [
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #5',
                    formula: 5,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #6',
                    formula: 6,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #7',
                    formula: 7,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    label: 'Formula #10',
                    formula: 10,
                  },
                ]
              },
              {
                type: DynamicLayoutItemType.TEMPLATE,
                value: 'foo',
                size: 50,
              },
            ],
          },
        ],
      },
    ],
  };

  readonly columns: ISimpleGridColumn<IRow>[] = [
    {
      label: 'ID',
      prop: 'id',
      filter: IGridFilterType.NUMBER,
    },
    {
      label: 'Foo',
      prop: 'foo',
      filter: IGridFilterType.TEXT,
    },
    {
      label: 'Bar',
      prop: 'bar',
      filter: IGridFilterType.TEXT,
    },
    {
      label: 'Dict',
      prop: 'dict',
      dictCode: 1,
    }
  ];

  readonly rows: IRow[] = Array(900).fill(null).map((_, i) => i + 1).map(id => ({
    id,
    foo: `Foo ${id}`,
    bar: `Bar ${id}`,
    dict: id % 4 + 1,
  }));

  templates: Record<string, TemplateRef<any>>;

  ngOnInit(): void {
    this.templates = {
      foo: this.foo,
      actions: this.actions
    };
  }
}
