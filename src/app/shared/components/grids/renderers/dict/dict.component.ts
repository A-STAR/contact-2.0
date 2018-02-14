import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
    selector: 'app-checkbox-cell-renderer',
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
    const { value } = this.params;
    return this.userDictionariesService
      .getDictionary(this.params['dictCode'])
      .pipe(
        map(dict => dict[value] ? dict[value].name : value),
      );
  }
}
