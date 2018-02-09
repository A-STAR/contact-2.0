import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { IGridTreeColumn, IGridTreeRow, IUniqueIdGetter } from '../gridtree/gridtree.interface';
import { IDataToValue, IGridWrapperTreeColumn } from './gridtree-wrapper.interface';
import { IOption } from '../../../core/converter/value-converter.interface';

import { GridTreeWrapperService } from './gridtree-wrapper.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

import { GridTreeComponent } from '../gridtree/gridtree.component';


/**
 * @deprecated
 * Use app-gridtree2-wrapper instead
 */
@Component({
  selector: 'app-gridtree-wrapper',
  templateUrl: './gridtree-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTreeWrapperService ]
})
export class GridTreeWrapperComponent<T> {
  @Input() dnd = false;
  @Output() select = new EventEmitter<IGridTreeRow<T>>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T>>();
  @Output() move = new EventEmitter<Array<IGridTreeRow<T>>>();
  @ViewChild(GridTreeComponent) gridTree: GridTreeComponent<T>;

  private _dictionaries: { [key: number]: IOption[] };
  private _columns: IGridWrapperTreeColumn<T>[];
  private _columnsForGrid: IGridTreeColumn<T>[];
  private _rows: IGridTreeRow<T>[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  get columnsForGrid(): IGridTreeColumn<T>[] {
    return this._columnsForGrid;
  }

  get columns(): IGridWrapperTreeColumn<T>[] {
    return this._columns;
  }

  @Input('columns')
  set columns(columns: IGridWrapperTreeColumn<T>[]) {
    this._columns = columns;
    this.updateColumnsForGrid();
    this.loadDictionaries();
  }

  get rows(): Array<IGridTreeRow<T>> {
    return this._rows;
  }

  @Input('rows')
  set rows(rows: Array<IGridTreeRow<T>>) {
    this._rows = rows;
    this.loadDictionaries();
  }

  @Input() idGetter = ((row: IGridTreeRow<T>) => row.data['id']) as IUniqueIdGetter<T>;

  onRowSelect(row: IGridTreeRow<T>): void {
    this.select.emit(row);
  }

  onRowDblClick(row: IGridTreeRow<T>): void {
    this.dblclick.emit(row);
  }

  onMove(event: Array<IGridTreeRow<T>>): void {
    this.move.emit(event);
  }

  private loadDictionaries(): void {
    const dictCodes = this._columns
      .map(column => column.dictCode)
      .filter(Boolean)
      .reduce((acc, dictCode) => [ ...acc, ...this.getRowDictCodes(dictCode, this._rows) ], [])
      .reduce((acc, dictCode) => acc.includes(dictCode) ? acc : [ ...acc, dictCode ], []);

    this.userDictionariesService.getDictionariesAsOptions(dictCodes)
      .pipe(first())
      .subscribe(dictionaries => {
        this._dictionaries = dictionaries;
        this.updateColumnsForGrid();
        this.cdRef.markForCheck();
      });
  }

  private getRowDictCodes(dictCode: any, rows: IGridTreeRow<T>[] = []): number[] {
    return dictCode instanceof Function
      ? rows
          .reduce((acc, row) => [ ...acc, ...this.getRowDictCodes(dictCode, row.children), dictCode(row.data) ], [])
          .filter(Boolean)
      : [ dictCode ];
  }

  private dictCodeFormatter(dictCode: number | ((row: T) => number), valueFormatter: IDataToValue<T, string>): any {
    return (value, data) => {
      const dictCodeValue = dictCode instanceof Function ? dictCode(data) : dictCode;
      const dictionary = this._dictionaries[dictCodeValue];
      if (!dictionary) {
        return valueFormatter ? valueFormatter(value, data) : value;
      }
      const option = dictionary.find(o => String(o.value) === String(value));
      const formattedValue = option ? option.label : value;
      return valueFormatter ? valueFormatter(formattedValue, data) : formattedValue;
    };
  }

  private updateColumnsForGrid(): void {
    this._columnsForGrid = this._columns.map(column => ({
      label: column.label,
      prop: column.prop,
      valueGetter: column.valueGetter,
      valueFormatter: column.dictCode
        ? this.dictCodeFormatter(column.dictCode, column.valueFormatter)
        : column.valueFormatter,
    }));
  }
}
