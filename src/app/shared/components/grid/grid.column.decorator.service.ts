import { Injectable } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs/Observable';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

@Injectable()
export class GridColumnDecoratorService {

  public decorateColumn(column: TableColumn, decoratorFn: Function): TableColumn {
    column.$$valueGetter = (row: any, fieldName: string) => {
      return decoratorFn(row, Reflect.get(row, fieldName));
    };
    return column;
  }

  public decorateRelatedEntityColumn(column: TableColumn, entitiesLoader: Observable<ILabeledValue[]>): TableColumn {
    let entities: ILabeledValue[] = [];
    entitiesLoader.subscribe((data) => entities = data);

    return this.decorateColumn(column,
      (entity) => {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.prop]);
        return labeledValue.label || labeledValue.value;
      });
  }
}
