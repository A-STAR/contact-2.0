import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';
import { IGridColumn } from './grid.interface';

@Injectable()
export class GridColumnDecoratorService {

  constructor(private translateService: TranslateService) {
  }

  public decorateColumn(column: IGridColumn, decoratorFn: Function | Observable<ILabeledValue[]>): IGridColumn {
    let entities: ILabeledValue[] = [];
    const isObservableDecorator: boolean = decoratorFn instanceof Observable;
    if (isObservableDecorator) {
      (decoratorFn as Observable<ILabeledValue[]>).subscribe((data) => entities = data);
    }
    column.$$valueGetter = (entity: any, fieldName: string) => {
      const value: any = Reflect.get(entity, fieldName);

      if (isObservableDecorator) {
        const labeledValue: ILabeledValue = entities.find(v => v.value === entity[column.prop]);
        return labeledValue
          ? (column.localized ? this.translateService.instant(labeledValue.label) : labeledValue.label)
          : entity[column.prop];
      } else {
        const displayedValue = String((decoratorFn as Function)(entity, value));
        return column.localized
          ? this.translateService.instant(displayedValue)
          : displayedValue;
      }
    };
    return column;
  }
}
