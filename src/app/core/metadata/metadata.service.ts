import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { IAppState } from '../state/state.interface';
import { IMetadataAction, IMetadataColumn, IMetadataState, MetadataListStatusEnum } from './metadata.interface';

@Injectable()
export class MetadataService {
  static METADATA_FETCH = 'METADATA_FETCH';
  static METADATA_FETCH_SUCCESS = 'METADATA_FETCH_SUCCESS';
  static METADATA_FETCH_FAILURE = 'METADATA_FETCH_FAILURE';

  private state: IMetadataState;

  constructor(private store: Store<IAppState>) {
    this.state$.subscribe(state => this.state = state);
  }

  refresh(key: string): void {
    this.store.dispatch({
      type: MetadataService.METADATA_FETCH,
      payload: { key }
    });
  }

  getData(key: string): Observable<any> {
    const status = this.state[key] && this.state[key].status;
    if (!status || status === MetadataListStatusEnum.ERROR) {
      this.refresh(key);
    }
    return this.state$
      .map(state => state[key])
      .filter(list => list && list.status === MetadataListStatusEnum.LOADED);
  }

  private get state$(): Observable<IMetadataState> {
    return this.store.select(state => state.metadata)
      .filter(Boolean)
      .distinctUntilChanged();
  }
}
