import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { IRendererCallbackParams } from '../../grids.interface';

@Component({
  selector: 'app-callback-renderer',
  template: `{{ value }}`
})
export class CallbackRendererComponent implements ICellRendererAngularComp {

  private params: IRendererCallbackParams;

  agInit(params: IRendererCallbackParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value(): string {
    return this.params.rendererCallback(this.params.data);
  }

}
