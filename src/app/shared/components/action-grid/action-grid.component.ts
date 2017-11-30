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
import { IAGridAction, IAGridRequestParams, IAGridSelected } from '../grid2/grid2.interface';
import { IActionGridDialogSelectionParams } from '../action-grid/action-grid.interface';
import { IGridColumn } from '../grid/grid.interface';

import { GridComponent } from '../../components/grid/grid.component';
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
  @Input() columns: IGridColumn[];
  @Input() columnTranslationKey: string;
  @Input() metadataKey: string;
  @Input() persistenceKey: string;
  @Input() rowIdKey: string;
  @Input() ngClass: string;
  @Input() rows: T[] = [];
  @Input() rowCount: number;
  @Input() styles: CSSStyleDeclaration;

  @Output() request = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<T>();
  @Output() select = new EventEmitter<IAGridSelected>();
  @Output() action = new EventEmitter<IActionGridDialogData>();

  @ViewChild('grid') grid: GridComponent | Grid2Component;

  dialog: string;
  dialogData: IActionGridDialogData;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  get selection(): T[] {
    return this.grid.selected as any[];
  }

  get isUsingAGGrid(): boolean {
    return !!this.metadataKey;
  }

  getSelectionParam(key: number): any[] {
    return this.dialogData.selection[key];
  }

  getConfiguredParams(): any[] {
    const idNames = this.dialogData.action.metadataAction.params;
    const rowsOfIdValues = this.dialogData.selection;
    // TODO ref with Array.prototype.reduce (m.bobryshev)
    const acc = [];
    idNames.forEach((idName, idNum) => {
      rowsOfIdValues[idNum].forEach( ( current, ind ) => {
        if (!acc[ind]) {
          acc[ind] = {};
        }
        acc[ind][idName] = current;
        return acc;
      });
    });
    return acc;
  }

  getDialogParam(key: number): number | string {
    return this.dialogData.params[key];
  }

  getFilters(): FilterObject {
    return this.grid instanceof Grid2Component
      ? this.grid.getFilters()
      : null;
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid instanceof Grid2Component
      ? this.grid.getRequestParams()
      : null;
  }

  onAction(gridAction: IAGridAction): void {
    const { metadataAction, params } = gridAction;
    this.dialog = metadataAction.action;
    this.dialogData = {
      action: gridAction,
      params: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: params.node.data[param]
      }), {}),
      selection: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: this.selection.map(item => item[param])
      }), {}),
    };
    this.cdRef.markForCheck();
  }

  onRequest(): void {
    this.request.emit();
  }

  onDblClick(row: T): void {
    this.dblClick.emit(row);
  }

  onSelect(selected: number[]): void {
    this.select.emit(selected);
  }
}
