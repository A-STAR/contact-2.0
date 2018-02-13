import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColDef } from 'ag-grid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-grids',
  templateUrl: './grids.component.html'
})
export class GridsComponent {
  columns: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'foo',
      headerName: 'Foo',
    },
    {
      field: 'bar',
      headerName: 'Bar',
    }
  ];

  rows = Array(100).fill(null).map((_, i) => i + 1).map(id => ({
    id,
    foo: `Foo ${id}`,
    bar: `Bar ${id}`,
  }));
}
