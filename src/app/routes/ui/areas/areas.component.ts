import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { range } from '@app/core/utils';

interface IRow {
  id: number;
  name: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-areas',
  templateUrl: './areas.component.html'
})
export class AreasComponent {
  columns: ISimpleGridColumn<IRow>[] = [
    { prop: 'id', label: 'ID' },
    { prop: 'name', label: 'Name' }
  ];

  rows: IRow[] = range(1, 100).map(id => ({ id, name: `Item ${id}` }));
}
