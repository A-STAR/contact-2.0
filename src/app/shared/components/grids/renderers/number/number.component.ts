import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-number-renderer',
  template: `{{ value }}`,
})
export class NumberRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value(): string {
    return this.params.value;
  }
}
