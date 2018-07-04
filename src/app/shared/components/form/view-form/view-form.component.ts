import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { IViewFormControl, IViewFormData, IViewFormItem } from './view-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-form',
  styleUrls: [ './view-form.component.scss' ],
  templateUrl: './view-form.component.html',
})
export class ViewFormComponent {
  @Input() data: IViewFormData = {};
  @Input() controls: IViewFormControl[] = [];

  isLoading = false;

  constructor(
    private userDictionariesService: UserDictionariesService,
    private valueConverterService: ValueConverterService,
  ) {}

  get items(): any {
    return this.controls.map(control => ({
      control,
      value: this.data && this.data[control.controlName],
    }));
  }

  getStyle(item: IViewFormItem): Partial<CSSStyleDeclaration> {
    return {
      flexBasis: item.width ? `${100 / 12 * item.width}%` : '100%',
    };
  }

  getValue(item: IViewFormControl, value: any): Observable<string> {
    switch (item.type) {
      case 'date':
        return of(this.valueConverterService.toLocalDate(value));
      case 'dict':
        return item.dictCode
          ? this.userDictionariesService.getDictionary(item.dictCode).pipe(
              map(terms => {
                const term = terms.find(t => t.code === value);
                return term ? term.name : value;
              }),
            )
          : of('');
      default:
        return of(value);
    }
  }
}
