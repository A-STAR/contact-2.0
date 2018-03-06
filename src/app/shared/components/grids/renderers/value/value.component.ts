import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-tick-renderer',
  templateUrl: './value.component.html',
})
export class ValueRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get type(): number {
    const { data, valueTypeKey } = this.params as any;
    return data[valueTypeKey];
  }

  get value(): boolean {
    return this.params.value;
  }
}
