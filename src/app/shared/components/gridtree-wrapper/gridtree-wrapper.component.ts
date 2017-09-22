import { Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';

import { IGridTreeColumn, IGridTreeRow, IUniqueIdGetter } from '../gridtree/gridtree.interface';
import { IGridWrapperTreeColumn } from './gridtree-wrapper.interface';
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
      valueFormatter: column.dictCode ? this.dictCodeFormatter(column.dictCode) : column.valueFormatter,
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
    console.log(row);
    this.dblclick.emit(row);
  }

  private loadDictionaries(): void {
    const dictCodes = this.columns
      .map(column => column.dictCode)
      .filter(Boolean)
      .reduce((acc, dictCode) => {
        const dictCodesToAdd = dictCode instanceof Function
          ? this._rows.map(row => dictCode(row.data)).filter(Boolean)
          : [ dictCode ];
        return [ ...acc, ...dictCodesToAdd ];
      }, [])
      .reduce((acc, dictCode) => acc.includes(dictCode) ? acc : [ ...acc, dictCode ], []);

    this.userDictionariesService.getDictionariesAsOptions(dictCodes)
      .take(1)
      .subscribe(dictionaries => {
        this._dictionaries = dictionaries;
        this.cdRef.markForCheck();
      });
  }

  private dictCodeFormatter(dictCode: number | ((row: T) => number)): any {
    // TODO(d.maltsev): compose value formatter
    return (value, data) => {
      const dictCodeValue = dictCode instanceof Function ? dictCode(data) : dictCode;
      const dictionary = this._dictionaries[dictCodeValue];
      if (!dictionary) {
        return value;
      }
      const option = dictionary.find(o => String(o.value) === String(value));
      return option ? option.label : value;
    };
  }
}
