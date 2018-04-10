import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-checkbox-renderer',
  template: `<app-checkbox *ngIf="isShown" [ngModel]="value" (ngModelChange)="onChange($event)"></app-checkbox>`,
})
export class FSMCheckboxRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;
  private onAction: any;

  value: boolean;
  isShown = true;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
    this.onAction = params.onAction;
    this.onAction(this.params, this.value);
    // this.isShown = typeof params.isDisplayed === 'function' ? params.isDisplayed(params.data) : true;
  }

  refresh(): boolean {
    return false;
  }

  onChange(value: boolean): void {
    this.onAction(this.params, value);
    // this.params.node.setDataValue(this.params.column, value);
  }
}
