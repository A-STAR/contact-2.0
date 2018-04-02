import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import { IMetadata, IMetadataState, MetadataListStatusEnum } from './metadata.interface';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class MetadataService {
  static METADATA_FETCH = 'METADATA_FETCH';
  static METADATA_FETCH_SUCCESS = 'METADATA_FETCH_SUCCESS';
  static METADATA_FETCH_FAILURE = 'METADATA_FETCH_FAILURE';

  private state: IMetadataState;

  private readonly state$ = this.store.pipe(
    select(state => state.metadata),
    filter(Boolean),
    distinctUntilChanged()
  );

  constructor(private store: Store<IAppState>) {
    this.state$.subscribe(state => this.state = state);
  }

  refresh(key: string): void {
    this.store.dispatch({
      type: MetadataService.METADATA_FETCH,
      payload: { key }
    });
  }

  getData(key: string): Observable<IMetadata> {
    const status = this.state[key] && this.state[key].status;
    if (!status || status === MetadataListStatusEnum.ERROR) {
      this.refresh(key);
    }
    return this.state$
      .pipe(
        map(state => state[key]),
        filter(list => list && list.status === MetadataListStatusEnum.LOADED)
      );
  }
}
