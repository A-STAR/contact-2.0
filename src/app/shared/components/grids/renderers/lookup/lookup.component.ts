import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid/main';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { LookupService } from '@app/core/lookup/lookup.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-lookup-renderer',
  template: `{{ value$ | async }}`,
})
export class LookupRendererComponent implements ICellRendererAngularComp {
  private params: ICellRendererParams;

  constructor(
    private lookupService: LookupService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  get value$(): Observable<string> {
    const { value } = this.params;
    return value ? this.lookupService
      .lookup(this.params['lookupKey'])
      .pipe(
        map(lookup => {
          const item = lookup.find(l => (l['id'] || l['code']) === value);
          return item ? item['name'] : value;
        }),
      ) : of(null);
  }
}
