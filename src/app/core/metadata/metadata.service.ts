import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { IAppState } from '../state/state.interface';
import { IMetadataListsState, IMetadataState } from './metadata.interface';

@Injectable()
export class MetadataService {
  static METADATA_FETCH = 'METADATA_FETCH';
  static METADATA_FETCH_SUCCESS = 'METADATA_FETCH_SUCCESS';
  static METADATA_FETCH_FAILURE = 'METADATA_FETCH_FAILURE';

  constructor(
    private store: Store<IAppState>
  ) {}

  refresh(): void {
    this.store.dispatch({
      type: MetadataService.METADATA_FETCH
    });
  }

  get isResolved(): Observable<boolean> {
    return this.state.map(metadata => metadata.lists).filter(Boolean);
  }

  get metadata(): Observable<IMetadataListsState> {
    return this.state.map(metadata => metadata.lists);
  }

  private get state(): Observable<IMetadataState> {
    return this.store.select(state => state.metadata)
      .distinctUntilChanged();
  }
}
