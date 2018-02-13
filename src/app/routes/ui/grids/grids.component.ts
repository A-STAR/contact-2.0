import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColDef } from 'ag-grid';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

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
    },
    {
      label: 'Foo',
      prop: 'foo',
    },
    {
      label: 'Bar',
      prop: 'bar',
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
