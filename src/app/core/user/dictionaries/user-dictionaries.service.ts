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

  get isResolved(): Observable<boolean> {
    return this.state.map(state => state.isResolved);
  }

  createRefreshAction(): Action {
    return {
      type: UserDictionariesService.USER_DICTIONARY_FETCH
    };
  }

  refresh(): void {
    const action = this.createRefreshAction();
    this.store.dispatch(action);
  }

  getDictionary(dictionaryId: number): Observable<IDictionary> {
    return this.state.map(state => state.dictionaries[dictionaryId]);
  }

  private get state(): Observable<IUserDictionariesState> {
    return this.store.select(state => state.userDictionaries);
  }
}
