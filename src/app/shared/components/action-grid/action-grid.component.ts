import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';

import { Grid2Component } from '../../components/grid2/grid2.component';

import { DialogFunctions } from '../../../core/dialog';

@Component({
  selector: 'app-action-grid',
  templateUrl: 'action-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ActionGridComponent extends DialogFunctions {
  @Input() metadataKey: string;
  @Input() persistenceKey: string;
  @Input() rowIdKey: string;
  @Input() ngClass: string;
  @Input() rows: any[];
  @Input() rowCount: number;

  @Output() request = new EventEmitter<any>();
  @Output() dblClick = new EventEmitter<any>();

  @ViewChild(Grid2Component) grid: Grid2Component;

  dialog: string;
  dialogParams: any;

  getFilters(): any {
    return this.grid.getFilters();
  }

  getRequestParams(): any {
    return this.grid.getRequestParams();
  }

  onAction({ action, params }: any): void {
    this.dialog = action.action;
    this.dialogParams = action.params.reduce((acc, param) => ({
      ...acc,
      [param]: params.node.data[param]
    }), {});
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(event: any): void {
    this.dblClick.emit(event);
  }
}
