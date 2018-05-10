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
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
                    formula: 1,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
                    formula: 2,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
                    formula: 3,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
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
                    key: 'ctx.debt.id',
                    formula: 1,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
                    formula: 2,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
                    formula: 3,
                  },
                  {
                    type: DynamicLayoutItemType.ATTRIBUTE,
                    key: 'ctx.debt.id',
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
    };
  }
}
