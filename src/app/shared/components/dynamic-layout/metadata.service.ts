import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap, take, filter } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { DynamicLayoutAction, IDynamicLayoutConfig, IDynamicLayoutFetchConfigAction } from './dynamic-layout.interface';

import { DataService } from '@app/core/data/data.service';
import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class MetadataService {
  constructor(
    private store: Store<IAppState>,
    private configService: ConfigService,
    private dataService: DataService
  ) { }

  getConfig(layout: string): Observable<IDynamicLayoutConfig> {
    return this.store.pipe(
      select(
        (state: IAppState) => state.layout[layout] && state.layout[layout].config
      ),
      tap(
        (config: IDynamicLayoutConfig) => !config && this.dispatchFetchConfigAction(layout)
      ),
      filter(Boolean),
      take(1),
    );
  }

  fetchConfig(key: string): Observable<IDynamicLayoutConfig> {
    const { assets } = this.configService.config;
    return this.dataService.get(`${assets}/forms/${key}.json`);
  }

  private dispatchFetchConfigAction(key: string): void {
    const action: IDynamicLayoutFetchConfigAction = {
      type: DynamicLayoutAction.FETCH_CONFIG,
      payload: { key },
    };
    this.store.dispatch(action);
  }

}
