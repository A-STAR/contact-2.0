import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { IAppState } from '../../state/state.interface';
import { IOption } from '../../converter/value-converter.interface';
import { ITransformCallback, IUserDictionariesState, IUserDictionaries, IUserDictionary, IUserTerm } from './user-dictionaries.interface';

import { UserDictionariesService } from './user-dictionaries.service';

@Injectable()
export class UserDictionaries2Service {
  private state: IUserDictionariesState;

  constructor(private store: Store<IAppState>) {
    this.state$.subscribe(state => this.state = state);
  }

  createRefreshAction(dictionaryId: number): Action {
    return {
      type: UserDictionariesService.USER_DICTIONARY_FETCH,
      payload: { dictionaryId }
    };
  }

  getDictionary(id: number): Observable<IUserDictionary> {
    return this.loadDictionaries([ id ], term => term).map(dictionaries => dictionaries[id]);
  }

  getDictionaries(ids: Array<number>): Observable<IUserDictionaries> {
    return this.loadDictionaries(ids, term => term);
  }

  getDictionaryAsOptions(id: number): Observable<Array<IOption>> {
    return this.loadDictionaries([ id ], term => ({ value: term.code, label: term.name })).map(dictionaries => dictionaries[id]);
  }

  getDictionariesAsOptions(ids: Array<number>): Observable<{ [key: number]: Array<IOption> }> {
    return this.loadDictionaries(ids, term => ({ value: term.code, label: term.name }));
  }

  private loadDictionaries<T>(ids: Array<number>, transform: ITransformCallback<T>): Observable<{ [key: number]: Array<T> }> {
    ids.forEach(id => {
      if (!this.state.dictionaries[id]) {
        const action = this.createRefreshAction(id);
        this.store.dispatch(action);
      }
    });

    return this.state$
      .map(state => ids.reduce((acc, id) => {
        const dictionary = state.dictionaries[id];
        return {
          ...acc,
          [id]: dictionary ? dictionary.map(transform) : null
        };
      }, {}))
      .filter(dictionaries => Object.keys(dictionaries).reduce((acc, key) => acc && !!dictionaries[key], true))
      .distinctUntilChanged();
  }

  private get state$(): Observable<IUserDictionariesState> {
    return this.store.select(state => state.userDictionaries);
  }
}
