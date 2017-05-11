import { Injectable } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';

@Injectable()
export class GridColumnDecoratorService {

  public decorateColumn(column: TableColumn, decoratorFn: Function): TableColumn {
    column.$$valueGetter = (row: any, fieldName: string) => {
      return decoratorFn(row, Reflect.get(row, fieldName));
    };
    return column;
  }
}
