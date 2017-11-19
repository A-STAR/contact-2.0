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

import { IActionGridDialogData } from './action-grid.interface';
import { IAGridAction, IAGridRequestParams, IContextMenuItem, IAGridSelected } from '../grid2/grid2.interface';

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
  @Input() contextMenuItems: IContextMenuItem[];

  @Output() request = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<T>();
  @Output() select = new EventEmitter<IAGridSelected>();
  @Output() action = new EventEmitter<IActionGridDialogData>();

  @ViewChild(Grid2Component) grid: Grid2Component;

  dialog: string;

  dialogData: IActionGridDialogData;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  getDialogParam(key: string): number | string {
    return this.dialogData.params[key];
  }

  getFilters(): FilterObject {
    return this.grid.getFilters();
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid.getRequestParams();
  }

  onAction(gridAction: IAGridAction): void {
    const { metadataAction, params } = gridAction;
    this.dialog = metadataAction.action;
    this.dialogData = {
      action: gridAction,
      params: metadataAction.params.reduce((acc, param) => ({
        ...acc,
        [param]: params.node.data[param]
      }), {})
    };
    this.action.emit(this.dialogData);
    this.cdRef.markForCheck();
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(row: T): void {
    this.dblClick.emit(row);
  }

  onSelect(selected: IAGridSelected): void {
    this.select.emit(selected);
  }
}
