import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn } from './grid.interface';

@Injectable()
export class GridColumnDecoratorService {

  constructor(private translateService: TranslateService) {
  }

  public decorateColumn(column: IGridColumn, decoratorFn: Function): IGridColumn {
    column.$$valueGetter = (entity: any, fieldName: string) => {
      const value: any = Reflect.get(entity, fieldName);
      column.localized
        ? this.translateService.instant(decoratorFn(entity, value))
        : decoratorFn(entity, value);
    };
    return column;
  }

  public decorateRelatedEntityColumn(column: IGridColumn, entitiesLoader: Observable<ILabeledValue[]>, localize?: boolean): IGridColumn {
    let entities: ILabeledValue[] = [];
    entitiesLoader.subscribe((data) => entities = data);

    return this.decorateColumn(column,
      (entity) => {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.prop]);
        return labeledValue
          ? (localize ? this.translateService.instant(labeledValue.label) : labeledValue.label)
          : entity[column.prop];
      });
  }
}
