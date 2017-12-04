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

import { IActionGridDialogData, ICloseAction } from './action-grid.interface';
import { IAGridAction, IAGridRequestParams, IAGridSelected } from '../grid2/grid2.interface';
import { IGridColumn, IContextMenuItem } from '../grid/grid.interface';

import { GridComponent } from '../../components/grid/grid.component';
import { MetadataGridComponent } from '../../components/metadata-grid/metadata-grid.component';

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
  @Input() contextMenuOptions: IContextMenuItem[];
  @Input() styles: CSSStyleDeclaration;
  @Input() showFilter: boolean;
  @Output() request = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<T>();
  @Output() select = new EventEmitter<IAGridSelected>();
  @Output() action = new EventEmitter<IActionGridDialogData>();

  @ViewChild('grid') grid: GridComponent | MetadataGridComponent<T>;

  dialog: string;
  dialogData: IActionGridDialogData;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  get selection(): T[] {
    return this.grid.selected as T[];
  }

  get isUsingAGGrid(): boolean {
    return !!this.metadataKey;
  }

  getAddOptions(name: string): (number|string)[] {
    // TODO(d.maltsev): not optimized; better to convert to key: value object on initialization
    return this.dialogData.addOptions.find(option => option.name === name).value;
  }

  getSelectionParam(key: number): any[] {
    return this.dialogData.selection[key];
  }

  getConfiguredParams(): any[] {
    // const idNames = this.dialogData.params;
    // const { selection } = this.dialogData;
    // const container = Array(selection[0].length).fill({});
    // return idNames.reduce((acc, idName, id) => {
    //   selection[id].forEach((item, ind) => {
    //     acc[ind][idName] = item;
    //   });
    //   return acc as string;
    // }, container);
    return [ { debtId: 2, personId: 63, regionCode: 1 } ];
  }

  getDialogParam(key: number): number | string {
    return this.dialogData.params[key];
  }

  getFilters(): FilterObject {
    return this.grid instanceof MetadataGridComponent
      ? this.grid.getFilters()
      : null;
  }

  getRequestParams(): IAGridRequestParams {
    return this.grid instanceof MetadataGridComponent
      ? this.grid.getRequestParams()
      : null;
  }

  onAction(gridAction: IAGridAction): void {
    const { metadataAction, params } = gridAction;
    this.dialog = metadataAction.action;
    this.dialogData = {
      addOptions: metadataAction.addOptions,
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

  onSimpleGridAction(metadataAction: any): void {
    this.dialog = metadataAction.action;
    this.dialogData = {
      addOptions: metadataAction.addOptions,
      params: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: this.selection[0][param]
      }), {}),
      selection: metadataAction.params.reduce((acc, param, i) => ({
        ...acc,
        [i]: this.selection.map(item => item[param])
      }), {}),
    };
    this.cdRef.markForCheck();
  }

  onCloseAction(action: ICloseAction): void {
    if (action.refresh) {
      this.onRequest();
    }
    if (action.deselectAll) {
      const grid = (this.grid as MetadataGridComponent<T>);
      if (grid.grid) {
        grid.grid.deselectAll();
      } else {
        (this.grid as GridComponent).clearSelection();
      }
    }
    this.onCloseDialog();
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
