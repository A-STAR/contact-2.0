import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { GridApi } from 'ag-grid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html'
})
export class SimpleGridComponent<T> {
  @Input() columns;

  @Input('rows') set rows(rows: T[]) {
    this._rows = rows;
    this.updateRows();
  }

  private gridApi: GridApi;

  private _rows: T[];

  get rows(): T[] {
    return this._rows;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.updateRows();
  }

  private updateRows(): void {
    if (this.gridApi && this.rows) {
      this.gridApi.redrawRows();
    }
  }
}
