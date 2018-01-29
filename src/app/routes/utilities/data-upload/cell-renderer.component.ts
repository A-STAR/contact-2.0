import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { ICell } from './data-upload.interface';

@Component({
    selector: 'app-data-upload-cell-renderer',
    template: `<div style="height: 100%;" [title]="error | translate">{{ value }}</div>`,
})
export class CellRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value(): number {
    return this.params.valueFormatted === null ? '' : this.params.valueFormatted;
  }

  get error(): string {
    return this.getCell(this.params).errorMsg || '';
  }

  private getCell(params: ICellRendererParams): ICell {
    const columnId = params.column.getColId();
    return params.data.cells.find(cell => cell.columnId === columnId);
  }
}
