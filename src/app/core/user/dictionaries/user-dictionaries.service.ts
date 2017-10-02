import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../state/state.interface';
import { IOption } from '../../converter/value-converter.interface';
import { ITransformCallback, IUserDictionariesState, IUserDictionaries, IUserTerm } from './user-dictionaries.interface';

@Injectable()
export class UserDictionariesService {
  static DICTIONARY_VARIABLE_TYPE               =  1;
  static DICTIONARY_BOOLEAN_TYPE                =  2;
  static DICTIONARY_PRODUCT_TYPE                =  3;
  static DICTIONARY_ACTION_TYPES                =  4;
  static DICTIONARY_TERM_TYPES                  =  5;
  static DICTIONARY_BRANCHES                    =  6;
  static DICTIONARY_DEBT_STATUS                 =  7;
  static DICTIONARY_EMPLOYEE_ROLE               =  8;
  static DICTIONARY_DICTIONARY_TYPE             =  9;
  static DICTIONARY_DICTIONARY_TERM_TYPE        = 10;
  static DICTIONARY_DEBT_ORIGINATION_REASON     = 11;
  static DICTIONARY_PERSON_TYPE                 = 12;
  static DICTIONARY_GENDER                      = 13;
  // static DICTIONARY_MARITAL_STATUS           = 14;
  static DICTIONARY_FAMILY_STATUS               = 14; // WTF, this is not english => google
  static DICTIONARY_EDUCATION                   = 15;
  static DICTIONARY_IDENTITY_TYPE               = 16;
  static DICTIONARY_PHONE_TYPE                  = 17;
  static DICTIONARY_PHONE_STATUS                = 18;
  static DICTIONARY_REASON_FOR_STATUS_CHANGE    = 19;
  static DICTIONARY_PHONE_REASON_FOR_BLOCKING   = 20;
  static DICTIONARY_ADDRESS_TYPE                = 21;
  static DICTIONARY_ADDRESS_STATUS              = 22;
  static DICTIONARY_ADDRESS_REASON_FOR_BLOCKING = 23;
  static DICTIONARY_EMAIL_TYPE                  = 24;
  static DICTIONARY_EMAIL_REASON_FOR_BLOCKING   = 25;
  static DICTIONARY_REGIONS                     = 26;
  static DICTIONARY_DEBT_COMPONENTS             = 27;
  static DICTIONARY_CONTRACTOR_TYPE             = 28;
  static DICTIONARY_PORTFOLIO_DIRECTION         = 29;
  static DICTIONARY_PORTFOLIO_STATUS            = 30;
  static DICTIONARY_PORTFOLIO_STAGE             = 31;  // bloody EMPTY
  static DICTIONARY_CONTACT_TYPE                = 32;
  static DICTIONARY_DOCUMENT_TYPE               = 33;
  static DICTIONARY_DEBT_LIST_1                 = 34;
  static DICTIONARY_DEBT_LIST_2                 = 35;
  static DICTIONARY_DEBT_LIST_3                 = 36;
  static DICTIONARY_DEBT_LIST_4                 = 37;
  static DICTIONARY_WORK_TYPE                   = 38;
  static DICTIONARY_PROMISE_STATUS              = 39;
  static DICTIONARY_PAYMENT_STATUS              = 40;
  static DICTIONARY_PAYMENT_PURPOSE             = 41;
  static DICTIONARY_MESSAGE_TEMPLATE_TYPE       = 42;
  static DICTIONARY_ROLE_ENTITIES               = 43;
  static DICTIONARY_PERSON_ROLE                 = 44;
  static DICTIONARY_SMS_STATUS                  = 45;
  static DICTIONARY_SMS_SENDER                  = 46;
  static DICTIONARY_ATTRIBUTE_TREE_TYPE         = 47;
  static DICTIONARY_CONTACT_TREE_TYPE           = 48;
  static DICTIONARY_CONTACT_INPUT_MODE          = 51;
  static DICTIONARY_CONTACT_PROMISE_INPUT_MODE  = 52;

  static USER_DICTIONARY_FETCH         = 'USER_DICTIONARY_FETCH';
  static USER_DICTIONARY_FETCH_SUCCESS = 'USER_DICTIONARY_FETCH_SUCCESS';
  static USER_DICTIONARY_FETCH_FAILURE = 'USER_DICTIONARY_FETCH_FAILURE';

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

  getDictionary(id: number): Observable<Array<IUserTerm>> {
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
