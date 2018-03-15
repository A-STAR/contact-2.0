import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IValueRendererParams } from '@app/shared/components/grids/grids.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TYPE_CODES, getRawValue } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-tick-renderer',
  templateUrl: './value.component.html',
})
export class ValueRendererComponent implements ICellRendererAngularComp {

  type: TYPE_CODES;
  value: any;
  dictValue$: Observable<string>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {}

  agInit(params: IValueRendererParams): void {
    const { data, valueTypeKey, value } = params;
    this.type = data[valueTypeKey];
    // value is undefined on initial load
    // value is present after cellEditor changes
    if (this.type) {
      this.value = value ? value : getRawValue(params.data, valueTypeKey);
    } else if (!this.type) {
      this.value = value;
      this.type = TYPE_CODES.STRING;
    }

    if (this.type === TYPE_CODES.DICT) {
      this.dictValue$ = this.getDictValue(params, this.value);
    }
    // we mutate data because cellEditor won't have initial value
    // TODO(i.lobanov): find a way to avoid it
    data.value = this.value;

    this.cdRef.markForCheck();
  }

  refresh(): boolean {
    return false;
  }
  private getDictValue(params: IValueRendererParams, value: any): Observable<string> {
    const { data, valueTypeParams } = params;
    // TODO(i.lobanov): lookupKey
    if (valueTypeParams && valueTypeParams.dictCode) {

      const code = typeof valueTypeParams.dictCode === 'function' ? valueTypeParams.dictCode(data)
        : valueTypeParams.dictCode;

      return this.userDictionariesService
        .getDictionary(code)
        .pipe(
          map(terms => {
            const term = terms.find(t => t.code === value);
            return term ? term.name : value;
          }),
        );
    }
    return of(value);
  }
}
