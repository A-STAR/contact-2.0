import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { arrayToObject } from '../../utils';

import { IAppState } from '../../state/state.interface';
import { IOption } from '../../converter/value-converter.interface';
import { IUserDictionariesState, IUserDictionary, IUserTerm, IUserDictionaries } from './user-dictionaries.interface';

import { DataService } from '../../data/data.service';

@Injectable()
export class UserDictionariesService {
  static DICTIONARY_VARIABLE_TYPE               =  1;
  static DICTIONARY_BOOLEAN_TYPE                =  2;
  static DICTIONARY_PRODUCT_TYPE                =  3; // NOT READY
  static DICTIONARY_ACTION_TYPES                =  4;
  static DICTIONARY_TERM_TYPES                  =  5;
  static DICTIONARY_BRANCHES                    =  6; // NOT READY
  static DICTIONARY_DEBT_STATUS                 =  7; // NOT READY
  static DICTIONARY_EMPLOYEE_ROLE               =  8;
  static DICTIONARY_DICTIONARY_TYPE             =  9;
  static DICTIONARY_DICTIONARY_TERM_TYPE        = 10;
  static DICTIONARY_DEBT_ORIGINATION_REASON     = 11; // NOT READY
  static DICTIONARY_PERSON_TYPE                 = 12;
  static DICTIONARY_GENDER                      = 13;
  static DICTIONARY_MARITAL_STATUS              = 14; // NOT READY
  static DICTIONARY_EDUCATION                   = 15; // NOT READY
  static DICTIONARY_IDENTITY_TYPE               = 16;
  static DICTIONARY_PHONE_TYPE                  = 17;
  static DICTIONARY_PHONE_STATUS                = 18;
  static DICTIONARY_PHONE_REASON_FOR_BLOCKING   = 20;
  static DICTIONARY_ADDRESS_TYPE                = 21;
  static DICTIONARY_ADDRESS_STATUS              = 22;
  static DICTIONARY_ADDRESS_REASON_FOR_BLOCKING = 23;
  static DICTIONARY_EMAIL_TYPE                  = 24;
  static DICTIONARY_EMAIL_REASON_FOR_BLOCKING   = 25;
  static DICTIONARY_CONTRACTOR_TYPE             = 28;
  static DICTIONARY_PORTFOLIO_DIRECTION         = 29;
  static DICTIONARY_PORTFOLIO_STATUS            = 30;
  static DICTIONARY_PORTFOLIO_STAGE             = 31;

  static USER_DICTIONARY_FETCH         = 'USER_DICTIONARY_FETCH';
  static USER_DICTIONARY_FETCH_SUCCESS = 'USER_DICTIONARY_FETCH_SUCCESS';
  static USER_DICTIONARY_FETCH_FAILURE = 'USER_DICTIONARY_FETCH_FAILURE';

  constructor(private store: Store<IAppState>, private dataService: DataService) {}

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

  getDictionaryAsArray(dictionaryId: number): Observable<IUserTerm[]> {
    return this.state
      .map(state => state.dictionaries[dictionaryId] || [])
      .distinctUntilChanged();
  }

  getDictionaries(Ids: number[]): Promise<IUserDictionaries> {
    const mapDictionary = id => this.dataService
      .read('/dictionaries/{id}/userterms', { id })
      .toPromise()
      .then(resp => ({ id, terms: resp.userTerms }));

    const allDictionaries = Ids.map(mapDictionary);

    return Promise.all(allDictionaries).then(dictionaries => {
      return dictionaries.reduce((acc, dictionary) => {
            acc[dictionary.id] = [...dictionary.terms];
            return acc;
          }, {});
    });
  }

  getDictionary(dictionaryId: number): Observable<IUserDictionary> {
    return this.state
      .map(state => state.dictionaries[dictionaryId] || [])
      .map(arrayToObject('code'))
      .distinctUntilChanged();
  }

  getDictionaryOptions(dictionaryId: number): Observable<IOption[]> {
    // TODO(d.maltsev): remove this when the db has correct data
    switch (dictionaryId) {
      case UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE:
        return Observable.of([
          { value: 1, label: 'Системный' },
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
