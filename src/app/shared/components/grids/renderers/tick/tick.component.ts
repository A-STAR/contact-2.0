import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-tick-renderer',
  template: `
    <div class="text-center">
      <i *ngIf="value" style="vertical-align: middle;" class="icon co-checkbox-mark"></i>
    </div>
  `,
})
export class TickRendererComponent implements ICellRendererAngularComp {
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
}
