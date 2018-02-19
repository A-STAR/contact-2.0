import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-checkbox-renderer',
  template: `<app-checkbox [ngModel]="value" (ngModelChange)="onChange($event)"></app-checkbox>`,
})
export class CheckboxRendererComponent implements ICellRendererAngularComp {
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
