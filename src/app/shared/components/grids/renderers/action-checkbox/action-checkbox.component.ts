import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { IActionCheckboxRendererConfig } from '@app/shared/components/grids/grids.interface';

import { arrayFromBinary, binaryFromArray } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-action-checkbox-renderer',
  template: `<app-checkbox *ngIf="isShown" [ngModel]="value" (ngModelChange)="onChange($event)"></app-checkbox>`,
})
export class ActionCheckboxRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams & { config: IActionCheckboxRendererConfig };

  constructor(

  ) {}

  value: boolean;
  isShown = true;

  private actionProps: string[];
  private config: IActionCheckboxRendererConfig;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
    this.config = params.config;
    this.actionProps = this.config.props;
    this.isShown = typeof params.isDisplayed === 'function' ? params.isDisplayed(params.data) : true;
    // TODO(i.lobanov): find a proper way
    (this.params.node as any).context.cmp = this;
  }

  refresh(): boolean {
    return false;
  }

  onChange(value: boolean): void {
    this.setStates(value);
  }

  private setStates(value: boolean): void {
    const state = this.applyInput([ this.params.column.getColId(), value ], this.params.data);
    Object.keys(state)
      .map(prop => this.params.node.setDataValue(this.params.columnApi.getColumn(prop), state[prop]));
  }

  private applyInput(input: [string, boolean], data: any): any {
    const oldState = this.actionProps.map(p => data[p]);
    const newState = oldState.slice();
    newState[this.actionProps.indexOf(input[0])] = input[1];

    const state = arrayFromBinary(this.config.masks.reduce((acc, m) => {
        if (parseInt(m.mask, 2) === acc && m.action) {
          return parseInt(m.action(acc), 2);
        }
        return acc;
      }, binaryFromArray(oldState.concat(newState)))
    );
    return this.actionProps.reduce((acc, prop, index) => ({
      ...acc,
      [prop]: state[index]
    }), {});
  }
}
