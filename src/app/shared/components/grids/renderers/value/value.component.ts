import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs/Observable';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TYPE_CODES, getRawValue } from '@app/core/utils';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { IValueRendererParams } from '@app/shared/components/grids/grids.interface';


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

    if (this.type) {
      this.value = value ? value : getRawValue(params.data, valueTypeKey);
    } else if (!this.type) {
      this.value = value;
      this.type = TYPE_CODES.STRING;
    }

    if (this.type === TYPE_CODES.DICT) {
      this.dictValue$ = this.getDictValue(params, this.value);
    }

    this.cdRef.markForCheck();
  }

  refresh(): boolean {
    return false;
  }

  private getDictValue(params: IValueRendererParams, value: any): Observable<string> {
    const { data, valueTypeParams } = params;
    const code = typeof valueTypeParams.dictCode === 'function' ? valueTypeParams.dictCode(data)
      : valueTypeParams.dictCode;
    return code
    ? this.userDictionariesService
        .getDictionary(code)
        .pipe(
          map(terms => {
            const term = terms.find(t => t.code === value);
            return term ? term.name : value;
          }),
        )
    : of(value);
  }
}
