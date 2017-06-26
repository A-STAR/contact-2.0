import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../state/state.interface';
import { IUserDictionariesState, IDictionary } from './user-dictionaries.interface';

@Injectable()
export class UserDictionariesService {
  static USER_DICTIONARY_FETCH         = 'USER_DICTIONARY_FETCH';
  static USER_DICTIONARY_FETCH_SUCCESS = 'USER_DICTIONARY_FETCH_SUCCESS';
  static USER_DICTIONARY_FETCH_FAILURE = 'USER_DICTIONARY_FETCH_FAILURE';

  constructor(private store: Store<IAppState>) {}

  createRefreshAction(dictionaryId: number): Action {
    return {
      type: UserDictionariesService.USER_DICTIONARY_FETCH,
      payload: { dictionaryId }
    };
  }

  preload(dictionaryId: number): void {
    this.state
      .take(1)
      .subscribe(state => {
        if (!state.dictionaries[dictionaryId].isResolved) {
          this.refresh(dictionaryId);
        }
      });
  }

  refresh(dictionaryId: number): void {
    const action = this.createRefreshAction(dictionaryId);
    this.store.dispatch(action);
  }

  getDictionary(dictionaryId: number): Observable<IDictionary> {
    return this.state.map(state => state.dictionaries[dictionaryId]);
  }

  private get state(): Observable<IUserDictionariesState> {
    return this.store.select(state => state.userDictionaries);
  }
}
