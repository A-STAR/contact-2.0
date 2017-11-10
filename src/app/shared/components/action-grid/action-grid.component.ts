import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { IActionGridDialogParams } from './action-grid.interface';
import { IAGridAction, IAGridRequestParams } from '../grid2/grid2.interface';

import { Grid2Component } from '../../components/grid2/grid2.component';

import { DialogFunctions } from '../../../core/dialog';
import { FilterObject } from '../grid2/filter/grid-filter';

@Component({
  selector: 'app-action-grid',
  templateUrl: 'action-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ActionGridComponent<T> extends DialogFunctions {
  @Input() columnIds: string[];
  @Input() metadataKey: string;
  @Input() persistenceKey: string;
  @Input() rowIdKey: string;
  @Input() ngClass: string;
  @Input() rows: T[] = [];
  @Input() rowCount: number;

  @Output() request = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<T>();

  @ViewChild(Grid2Component) grid: Grid2Component;

  dialog: string;

  private dialogParams: IActionGridDialogParams;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  getDialogParam(key: string): number | string {
    return this.dialogParams[key];
  }

  getFilters(): FilterObject {
    return this.grid.getFilters();
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid.getRequestParams();
  }

  onAction({ action, params }: IAGridAction): void {
    this.dialog = action.action;
    this.dialogParams = action.params.reduce((acc, param) => ({
      ...acc,
      [param]: params.node.data[param]
    }), {});
    this.cdRef.markForCheck();
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(row: T): void {
    this.dblClick.emit(row);
  }
}
