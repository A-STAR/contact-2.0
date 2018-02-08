import {
  Component, ChangeDetectionStrategy, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { ColDef } from 'ag-grid';

import { IAGridWrapperTreeColumn, IDataToValue } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IUserDictionaryOptions } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { GridTree2WrapperService } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-gridtree2-wrapper',
  templateUrl: './gridtree2-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ GridTree2WrapperService ]
})
export class GridTree2WrapperComponent<T> implements OnInit, OnChanges {
  @Input() rows: IGridTreeRow<T>[];
  @Input() columns: IAGridWrapperTreeColumn<T>[];
  @Input() translateColumnLabels: boolean;
  @Input() dnd: boolean;
  @Input() rowHeight = 36;

  @Output() select = new EventEmitter<IGridTreeRow<T> | null>();
  @Output() move = new EventEmitter<IGridTreeRow<T> | null>();
  @Output() dblclick = new EventEmitter<IGridTreeRow<T>>();

  convertedCols: any[];
  convertedRows: any[];
  convertedColsDef: ColDef[];
  getDataPath: Function;
  autoGroupColumnDef: ColDef;

  private dictionaries: { [key: number]: IOption[] };

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridTree2WrapperService: GridTree2WrapperService<T>,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.convertedCols = this.gridTree2WrapperService.mapColumns(this.columns, this.translateColumnLabels);
    this.getDataPath = data => data[this.convertedCols.find(column => column.isDataPath).column.field];
    this.autoGroupColumnDef = {
      rowDrag: this.dnd,
      cellRendererParams: { suppressCount: true },
      ...this.convertedCols.find(column => column.isDataPath).column,
    };

    this.mapRows();

    this.loadDictionaries().pipe(first()).subscribe(dictionaries => {
      this.dictionaries = dictionaries;
      this.convertedColsDef = this.convertedCols.filter(column => !column.isDataPath).map(column => {
        return {
          ...column.column,
          valueFormatter: column.dictCode
            ? this.dictCodeFormatter(column.dictCode, column.column.valueFormatter)
            : column.column.valueFormatter,
        } as ColDef;
      });
      this.cdRef.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { rows } = changes;

    if (rows && rows.currentValue && !rows.firstChange) {
      this.mapRows();
    }
  }

  onSelect(row: any): void {
    this.select.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  onMove(row: any): void {
    this.move.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  onDblClick(row: any): void {
    this.dblclick.emit(this.gridTree2WrapperService.findSrcRowByUniqueId(this.rows, row.uniqueId));
  }

  private mapRows(): void {
    this.convertedRows = this.gridTree2WrapperService.mapRows(this.rows, this.convertedCols);
  }

  private loadDictionaries(): Observable<IUserDictionaryOptions> {
    const dictCodes = this.columns
      .map(column => column.dictCode)
      .filter(Boolean)
      .reduce((acc, dictCode) => [ ...acc, ...this.getRowDictCodes(dictCode, this.rows) ], [])
      .reduce((acc, dictCode) => acc.includes(dictCode) ? acc : [ ...acc, dictCode ], []);

    return this.userDictionariesService.getDictionariesAsOptions(dictCodes);
  }

  private getRowDictCodes(dictCode: any, rows: IGridTreeRow<T>[] = []): number[] {
    return dictCode instanceof Function
      ? rows
        .reduce((acc, row) => [ ...acc, ...this.getRowDictCodes(dictCode, row.children), dictCode(row.data) ], [])
        .filter(Boolean)
      : [ dictCode ];
  }

  private dictCodeFormatter(dictCode: number, valueFormatter: IDataToValue<T, string>): Function {
    return param => {
      const dictionary = this.dictionaries[dictCode];
      if (!dictionary) {
        return valueFormatter;
      }

      const option = dictionary.find(dict => String(dict.value) === String(param.value));
      return option ? option.label : param.value;
    };
  }
}
