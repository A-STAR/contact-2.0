import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColDef } from 'ag-grid';

import { IAGridWrapperTreeColumn } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IGridTreeRow } from '@app/shared/components/gridtree2/gridtree2.interface';

@Injectable()
export class GridTree2WrapperService<T> {

  private static readonly EXTRA_COLUMNS = [
    { column: { field: 'typeCode' } },
    { column: { field: 'valueB' } },
    { column: { field: 'valueS' } },
    { column: { field: 'valueN' } },
    { column: { field: 'valueD' } }
  ];

  constructor(private translate: TranslateService) { }

  mapColumns(columns: IAGridWrapperTreeColumn<T>[], translateColumnLabels?: boolean): any[] {
    return columns
      .filter(column => !!column.label)
      .map((column: IAGridWrapperTreeColumn<T>) => {
        // TODO(d.topheenko): model
        return {
          column: {
            field: column.name,
            headerName: translateColumnLabels ? this.translate.instant(column.label) : column.label,
            maxWidth: column.maxWidth,
            minWidth: column.minWidth,
            width: column.width || column.minWidth || column.maxWidth,
            valueGetter: column.valueGetter,
            valueFormatter: column.valueFormatter,
          } as ColDef, isDataPath: column.isDataPath, dictCode: column.dictCode
        };
      });
  }

  mapRows(sourceRows: IGridTreeRow<T>[], columns: any[]): any[] {
    const dataPathField = columns.find(column => column.isDataPath).column.field;
    const destinationRows = [];
    let uniqueId = 1;

    const fillRow = (sourceRow: IGridTreeRow<T>, destinationRow: any, column: any, parentDataPathValue?: any[]) => {
      if (parentDataPathValue) {
        destinationRow['uniqueId'] = uniqueId;
        sourceRow.uniqueId = uniqueId++;
      }

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
        rows.forEach((rowChild: any) => {
          const dstChildRow = {};
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
      const dstRow = { 'uniqueId': uniqueId };
      row.uniqueId = uniqueId++;

      columns.forEach(column => fillRow(row, dstRow, column));
      GridTree2WrapperService.EXTRA_COLUMNS.forEach(column => fillRow(row, dstRow, column));

      destinationRows.push(dstRow);
      walkChildren(row.children, [ row.data[dataPathField] ]);
    });

    return destinationRows;
  }

  findSrcRowByUniqueId(sourceRows: IGridTreeRow<T>[], uniqueId: number): IGridTreeRow<T> | null {
    let found = null;

    const walkChildren = (srcRowChild) => {
      if (srcRowChild.uniqueId === uniqueId) {
        found = srcRowChild;
        return true;
      }
      return srcRowChild.children && srcRowChild.children.some(walkChildren);
    };

    sourceRows.some(walkChildren);

    return found;
  }
}
