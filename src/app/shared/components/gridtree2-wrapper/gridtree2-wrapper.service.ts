import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ColDef } from 'ag-grid';

import { IAGridWrapperTreeColumn, IDataToValue } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { IUserDictionaryOptions } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class GridTree2WrapperService<T> {

  private static readonly EXTRA_COLUMNS = [
    { column: { field: 'typeCode' } },
    { column: { field: 'valueB' } },
    { column: { field: 'valueS' } },
    { column: { field: 'valueN' } },
    { column: { field: 'valueD' } }
  ];

  constructor(
    private translate: TranslateService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  mapColumns(columns: IAGridWrapperTreeColumn<T>[], translateColumnLabels?: boolean): any[] {
    return columns
      .filter(column => !!column.label)
      .map((column: IAGridWrapperTreeColumn<T>) => {
        // TODO(d.topheenko): model
        return {
          column: {
            cellRendererFramework: column.cellRendererFramework,
            field: column.name,
            headerName: translateColumnLabels ? this.translate.instant(column.label) : column.label,
            maxWidth: column.maxWidth,
            minWidth: column.minWidth,
            width: column.width || column.minWidth || column.maxWidth,
            valueGetter: column.valueGetter,
            valueFormatter: column.valueFormatter,
          } as ColDef,
          dictCode: column.dictCode,
          isDataPath: column.isDataPath,
        };
      });
  }

  mapRows(sourceRows: IGridTreeRow<T>[], columns: any[]): any[] {
    const dataPathField = columns.find(column => column.isDataPath).column.field;
    const destinationRows = [];
    let uniqueId = 1;

    const fillRow = (sourceRow: IGridTreeRow<T>, destinationRow: any, column: any, parentDataPathValue?: any[]) => {
      if (column.isDataPath) {
        destinationRow[column.column.field] = parentDataPathValue
          ? [ ...Array.from(new Set([ ...parentDataPathValue, sourceRow.data[column.column.field] ])) ]
          : [ sourceRow.data[column.column.field] ];
      } else {
        destinationRow[column.column.field] = sourceRow.data[column.column.field];
      }
    };

    const walkChildren = (rows: IGridTreeRow<T>[], parentDataPathValue: any[]) => {
      if (rows) {
        rows.forEach((rowChild: IGridTreeRow<T>) => {
          const dstChildRow = { 'uniqueId': uniqueId, 'isParent': !!rowChild.children };
          rowChild.uniqueId = uniqueId++;

          columns.forEach(column => fillRow(rowChild, dstChildRow, column, parentDataPathValue));
          GridTree2WrapperService.EXTRA_COLUMNS.forEach(column => fillRow(rowChild, dstChildRow, column, parentDataPathValue));

          destinationRows.push(dstChildRow);
          walkChildren(rowChild.children, rowChild.children
            ? [ ...parentDataPathValue, rowChild.data[dataPathField] ]
            : parentDataPathValue);
        });
      }
    };

    sourceRows.forEach((row: IGridTreeRow<T>) => {
      const dstRow = { 'uniqueId': uniqueId, 'isParent': true };
      row.uniqueId = uniqueId++;

      columns.forEach(column => fillRow(row, dstRow, column));
      GridTree2WrapperService.EXTRA_COLUMNS.forEach(column => fillRow(row, dstRow, column));

      destinationRows.push(dstRow);
      walkChildren(row.children, [ row.data[dataPathField] ]);
    });

    return destinationRows;
  }

  findSrcRowByUniqueId(sourceRows: IGridTreeRow<T>[], uniqueId: number): IGridTreeRow<T> | null {
    const found = sourceRows.find(srcRow => srcRow.uniqueId === uniqueId);
    if (found) {
      return found;
    }

    return sourceRows.reduce((acc, srcRow) => acc || (srcRow.children
        ? this.findSrcRowByUniqueId(srcRow.children, uniqueId)
        : null), null);
  }

  loadDictionaries(columns: IAGridWrapperTreeColumn<T>[], rows: IGridTreeRow<T>[]): Observable<IUserDictionaryOptions> {
    const dictCodes = columns
      .map(column => column.dictCode)
      .filter(Boolean)
      .reduce((acc, dictCode) => [ ...acc, ...this.getRowDictCodes(dictCode, rows) ], [])
      .reduce((acc, dictCode) => acc.includes(dictCode) ? acc : [ ...acc, dictCode ], []);

    return this.userDictionariesService.getDictionariesAsOptions(dictCodes);
  }

  getRowDictCodes(dictCode: any, rows: IGridTreeRow<T>[] = []): number[] {
    return dictCode instanceof Function
      ? rows
        .reduce((acc, row) => [ ...acc, ...this.getRowDictCodes(dictCode, row.children), dictCode(row.data) ], [])
        .filter(Boolean)
      : [ dictCode ];
  }

  dictCodeFormatter(dicts: { [key: number]: IOption[] }, dictCode: number, valueFormatter: IDataToValue<T, string>): Function {
    return param => {
      const dictionary = dicts[dictCode];
      if (!dictionary) {
        return valueFormatter;
      }

      const option = dictionary.find(dict => String(dict.value) === String(param.value));
      return option ? option.label : param.value;
    };
  }
}
