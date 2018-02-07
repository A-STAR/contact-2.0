import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColDef } from 'ag-grid';

import { IAGridWrapperTreeColumn } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';

import { flattenArray } from '@app/core/utils';

@Injectable()
export class GridTree2WrapperService<T> {

  constructor(private translate: TranslateService) { }

  mapColumns(columns: IAGridWrapperTreeColumn[], translateColumnLabels?: boolean): any[] {
    return columns
      .filter(column => !!column.label)
      .map((column: IAGridWrapperTreeColumn) => {
        return {
          column: {
            valueGetter: column.valueGetter,
            colId: column.colId,
            editable: column.editable,
            field: column.colId,
            headerName: translateColumnLabels ? this.translate.instant(column.label) : column.label,
            hide: !!column.hidden,
            maxWidth: column.maxWidth,
            minWidth: column.minWidth,
            width: column.width || column.minWidth || column.maxWidth,
          } as ColDef, isDataPath: column.isDataPath
        };
      });
  }

  mapRows(sourceRows: IGridTreeRow<T>[], columns: any[]): any[] {
    const destinationRows = [];
    let uniqueId = 1;

    const fillRow = (sourceRow: IGridTreeRow<T>, destinationRow: any, column: any, isChildRow: boolean) => {
      if (isChildRow) {
        destinationRow['uniqueId'] = uniqueId;
        sourceRow.uniqueId = uniqueId++;
      }

      if (column.isDataPath) {
        destinationRow[column.column.field] = isChildRow
          ? [
            ...Array.from(
              new Set(
                [ ...flattenArray(destinationRows.map((dstRow: any) => dstRow[column.column.field])),
                  sourceRow.data[column.column.field]
                ]))
          ]
          : [ sourceRow.data[column.column.field] ];
      } else {
        destinationRow[column.column.field] = column.column.valueGetter
          ? column.column.valueGetter(sourceRow)
          : sourceRow.data[column.column.field];
      }
    };

    const walkTree = (rows: IGridTreeRow<T>[]) => {
      if (rows) {
        rows.forEach((rowChild: any) => {
          const dstChildRow = {};
          columns.forEach(column => fillRow(rowChild, dstChildRow, column, true));

          destinationRows.push(dstChildRow);
          walkTree(rowChild.children);
        });
      }
    };

    sourceRows.forEach((row: IGridTreeRow<T>) => {
      const dstRow = { 'uniqueId': uniqueId };
      row.uniqueId = uniqueId++;

      columns.forEach(column => fillRow(row, dstRow, column, false));

      destinationRows.push(dstRow);
      walkTree(row.children);
    });

    return destinationRows;
  }

  findSrcRowByUniqueId(sourceRows: IGridTreeRow<T>[], uniqueId: number): IGridTreeRow<T> {
    // TODO
  }
}
