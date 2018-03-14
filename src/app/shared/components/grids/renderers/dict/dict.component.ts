import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-dict-renderer',
  template: `{{ value$ | async }}`,
})
export class DictRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;
  value$: Observable<string>;

  constructor(
    private userDictionariesService: UserDictionariesService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    const { data, dictCode, value } = this.params as any;
    const code = typeof dictCode === 'function' ? dictCode(data) : dictCode;
    this.value$ = code
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

  refresh(): boolean {
    return false;
  }
}
