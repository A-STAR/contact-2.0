import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IUniqueIdGetter } from '../gridtree/gridtree.interface';
import { IDataToValue, IGridWrapperTreeColumn } from './gridtree-wrapper.interface';
import { IOption } from '../../../core/converter/value-converter.interface';

import { GridTreeWrapperService } from './gridtree-wrapper.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-gridtree-wrapper',
  templateUrl: './gridtree-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTreeWrapperService ]
})
export class GridTreeWrapperComponent<T> {
  @Input() columns: Array<IGridWrapperTreeColumn<T>> = [];

  @Output() select = new EventEmitter<IGridTreeRow<T>>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T>>();

  private _dictionaries: { [key: number]: IOption[] };
  private _rows: Array<IGridTreeRow<T>> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  get columnsForGrid(): IGridTreeColumn<T>[] {
    return this.columns.map(column => ({
      label: column.label,
      prop: column.prop,
      valueGetter: column.valueGetter,
      valueFormatter: column.dictCode ? this.dictCodeFormatter(column.dictCode, column.valueFormatter) : column.valueFormatter,
    }));
  }

  get rows(): Array<IGridTreeRow<T>> {
    return this._rows;
  }

  @Input('rows')
  set rows(rows: Array<IGridTreeRow<T>>) {
    this._rows = rows;
    this.loadDictionaries();
    this.cdRef.markForCheck();
  }

  @Input() idGetter = ((row: IGridTreeRow<T>) => row.data['id']) as IUniqueIdGetter<T>;

  onRowSelect(row: IGridTreeRow<T>): void {
    this.select.emit(row);
  }

  onRowDblClick(row: IGridTreeRow<T>): void {
    this.dblclick.emit(row);
  }

  private loadDictionaries(): void {
    const dictCodes = this.columns
      .map(column => column.dictCode)
      .filter(Boolean)
      .reduce((acc, dictCode) => [ ...acc, ...this.getRowDictCodes(dictCode, this._rows) ], [])
      .reduce((acc, dictCode) => acc.includes(dictCode) ? acc : [ ...acc, dictCode ], []);

    this.userDictionariesService.getDictionariesAsOptions(dictCodes)
      .take(1)
      .subscribe(dictionaries => {
        this._dictionaries = dictionaries;
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
}
