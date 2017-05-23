import { Injectable } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

@Injectable()
export class GridColumnDecoratorService {

  constructor(private translateService: TranslateService) {
  }

  public decorateColumn(column: TableColumn, decoratorFn: Function): TableColumn {
    column.$$valueGetter = (row: any, fieldName: string) => decoratorFn(row, Reflect.get(row, fieldName));
    return column;
  }

  public decorateLocalizedColumn(column: TableColumn, decoratorFn: Function): TableColumn {
    return this.decorateColumn(column, (row, value) => this.translateService.instant(decoratorFn(row, value)));
  }

  public decorateRelatedEntityColumn(column: TableColumn, entitiesLoader: Observable<ILabeledValue[]>): TableColumn {
    let entities: ILabeledValue[] = [];
    entitiesLoader.subscribe((data) => entities = data);

    return this.decorateColumn(column,
      (entity) => {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.prop]);
        return labeledValue ? labeledValue.label : entity[column.prop];
      });
  }
}
