import { IViewportDatasource } from 'ag-grid';
import { Grid2Component } from '../grid2.component';

import { IViewportDatasourceParams } from '../grid2.interface';

export class ViewPortDatasource implements IViewportDatasource {
  params: IViewportDatasourceParams;
  grid: Grid2Component;

  constructor(grid: Grid2Component) {
    this.grid = grid;
  }

  init(params: IViewportDatasourceParams): void {
    this.params = params;
  }

  // the rows are mapped {key: rowIndex}: rowData
  convertData(data: Array<any>): any {
    return data.reduce((acc, row) => {
      acc[row.id] = row;
      return acc;
    }, {});
  }

  setViewportRange(firstRow: number): void {
    // const length = this.grid.gridRows && this.grid.gridRows.length;
    // log(`range: ${firstRow} to ${lastRow}, length: ${length}`);
    if (firstRow < this.grid.pageSize) {
      this.params.setRowData(this.grid.rows);
    }
  }

  destroy(): void {
    // Clean up
    this.grid = null;
    this.params = null;
  }
}
