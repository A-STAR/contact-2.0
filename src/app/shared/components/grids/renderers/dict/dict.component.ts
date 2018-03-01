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

  constructor(
    private userDictionariesService: UserDictionariesService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value$(): Observable<string> {
    const { data, dictCode, value } = this.params as any;
    const code = typeof dictCode === 'function' ? dictCode(data) : dictCode;
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
