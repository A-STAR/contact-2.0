import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-checkbox-cell-renderer',
    template: `
      <label>
        <app-checkbox
          [ngModel]="value"
          (ngModelChange)="onChange($event)"
        ></app-checkbox>
      </label>
    `,
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value(): boolean {
    return this.params.value;
  }

  onChange(value: boolean): void {
    this.params.node.setDataValue(this.params.column, value);
  }
}
