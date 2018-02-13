import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IGridFilterType } from '@app/shared/components/grids/grids.interface';

interface IRow {
  id: number;
  foo: string;
  bar: string;
  dict: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-grids',
  templateUrl: './grids.component.html'
})
export class GridsComponent {
  columns: ISimpleGridColumn<IRow>[] = [
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

  rows: IRow[] = Array(100).fill(null).map((_, i) => i + 1).map(id => ({
    id,
    foo: `Foo ${id}`,
    bar: `Bar ${id}`,
    dict: id % 2 + 1,
  }));
}
