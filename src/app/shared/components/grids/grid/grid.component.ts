import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid';
import { first } from 'rxjs/operators';

import { ISimpleGridColumn } from './grid.interface';

import { GridsService } from '../grids.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-simple-grid',
  styleUrls: [ './grid.component.scss' ],
  templateUrl: './grid.component.html'
})
export class SimpleGridComponent<T> {
  @Input()
  set columns(columns: ISimpleGridColumn<T>[]) {
    this.gridsService
      .convertColumnsToColDefs(columns)
      .pipe(
        first(),
      )
      .subscribe(colDefs => {
        this._colDefs = colDefs;
        this.updateColumns();
      });
  }

  @Input()
  set rows(rows: T[]) {
    this._rows = rows;
    this.updateRows();
  }

  private gridApi: GridApi;

  private _colDefs: ColDef[];
  private _rows: T[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridsService: GridsService,
  ) {}

  get colDefs(): ColDef[] {
    return this._colDefs;
  }

  get rows(): T[] {
    return this._rows;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.updateColumns();
    this.updateRows();
  }

  private updateColumns(): void {
    if (this.gridApi && this._colDefs) {
      this.gridApi.sizeColumnsToFit();
    }
    this.cdRef.markForCheck();
  }

  private updateRows(): void {
    if (this.gridApi && this._rows) {
      this.gridApi.redrawRows();
    }
    this.cdRef.markForCheck();
  }
}
