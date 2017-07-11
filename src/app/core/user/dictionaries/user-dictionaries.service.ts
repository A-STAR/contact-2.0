import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../state/state.interface';
import { IUserDictionariesState, IUserDictionary } from './user-dictionaries.interface';

@Injectable()
export class UserDictionariesService {
  static DICTIONARY_VARIABLE_TYPE       =  1;
  static DICTIONARY_EMPLOYEE_ROLE       =  8;
  static DICTIONARY_CONTRACTOR_TYPE     = 28;
  static DICTIONARY_PORTFOLIO_DIRECTION = 29;
  static DICTIONARY_PORTFOLIO_STATUS    = 30;
  static DICTIONARY_PORTFOLIO_STAGE     = 31;

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

  preload(dictionaryIds: Array<number>): void {
    this.state
      .take(1)
      .subscribe(state => {
        dictionaryIds.forEach(dictionaryId => {
          if (!state.dictionaries[dictionaryId]) {
            this.refresh(dictionaryId);
          }
        });
      });
  }

  refresh(dictionaryId: number): void {
    const action = this.createRefreshAction(dictionaryId);
    this.store.dispatch(action);
  }

  getDictionary(dictionaryId: number): Observable<IUserDictionary> {
    return this.state
      .map(state => state.dictionaries[dictionaryId] || [])
      .map(terms => terms.reduce((acc, term) => {
        acc[term.code] = term;
        return acc;
      }, {}))
      .distinctUntilChanged();
  }

  getDictionaryOptions(dictionaryId: number): Observable<any> {
    // TODO(d.maltsev): remove this when the db has correct data
    switch (dictionaryId) {
      case UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE:
        return Observable.of([
          { value: 1, label: 'Системный' },
        ]);
      case UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION:
        return Observable.of([
          { value: 1, label: 'Входящий' },
          { value: 2, label: 'Исходящий' },
        ]);
      case UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE:
        return Observable.of([
          { value: 1, label: 'Системный' },
        ]);
      case UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS:
        return Observable.of([
          { value: 1, label: 'Загружается' },
          { value: 2, label: 'В работе' },
          { value: 3, label: 'Закрыт' },
          { value: 4, label: 'Новый' },
          { value: 5, label: 'Сформирован' },
          { value: 6, label: 'Передан' },
          { value: 7, label: 'Отозван' },
          { value: 8, label: 'Окончание работ' },
          { value: 9, label: 'Архивный' },
          { value: 10, label: 'Архивный' },
        ]);
    }

    return this.state
      .map(state => state.dictionaries[dictionaryId] || [])
      .map(terms => terms.map(term => ({ value: term.code, label: term.name })))
      .distinctUntilChanged();
  }

  private get state(): Observable<IUserDictionariesState> {
    return this.store.select(state => state.userDictionaries);
  }
}
