import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { ActionRendererParams } from '../../grids.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-action-checkbox-renderer',
  template: `<app-checkbox *ngIf="isShown" [ngModel]="value" (ngModelChange)="onChange($event)"></app-checkbox>`,
})
export class ActionCheckboxRendererComponent implements ICellRendererAngularComp {
  private params: ActionRendererParams;

  value: boolean;
  isShown = true;

  constructor() {}

  agInit(params: ActionRendererParams): void {
    this.params = params;
    this.value = params.value;
    this.params.stateTree.addNode(params.data.path, params.data);
    this.isShown = typeof params.isDisplayed === 'function' ? params.isDisplayed(params.data) : true;
  }

  refresh(): boolean {
    return false;
  }

  onChange(value: boolean): void {
    this.setStates(value);
  }

  private setStates(value: boolean): void {
    const data = {...this.params.data, [this.params.colDef.field]: value };
    this.params.stateTree.onChange(data.path, data);
  }
}
