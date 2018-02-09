import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { TranslateService } from '@ngx-translate/core';

import { ICell } from './data-upload.interface';

@Component({
    selector: 'app-data-upload-cell-renderer',
    template: `<div style="height: 100%;" [title]="error | translate">{{ value }}</div>`,
})
export class CellRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  constructor(
    private translateService: TranslateService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value(): number {
    return this.params.value;
  }

  get error(): string {
    return this.getCell(this.params).errorMsg || this.translateService.instant('modules.dataUpload.errors.defaultError');
  }

  private getCell(params: ICellRendererParams): ICell {
    const columnId = params.column.getColId();
    return params.data.cells.find(cell => cell.columnId === columnId);
  }
}
