import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { of } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, tap, switchMap } from 'rxjs/operators';

import { IAppState } from '../../state/state.interface';
import { IOption } from '../../converter/value-converter.interface';
import {
  ITransformCallback, IUserDictionariesState, IUserDictionaries, IUserTerm, IUserDictionaryAction, IUserDictionaryOptions
} from './user-dictionaries.interface';
import { SafeAction } from '../../../core/state/state.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ValueBag } from '@app/core/value-bag/value-bag';

@Injectable()
export class UserDictionariesService {
  static DICTIONARY_VARIABLE_TYPE                 =  1;
  static DICTIONARY_BOOLEAN_TYPE                  =  2;
  static DICTIONARY_PRODUCT_TYPE                  =  3;
  static DICTIONARY_ACTION_TYPES                  =  4;
  static DICTIONARY_TERM_TYPES                    =  5;
  static DICTIONARY_BRANCHES                      =  6;
  static DICTIONARY_DEBT_STATUS                   =  7;
  static DICTIONARY_EMPLOYEE_ROLE                 =  8;
  static DICTIONARY_DICTIONARY_TYPE               =  9;
  static DICTIONARY_DICTIONARY_TERM_TYPE          = 10;
  static DICTIONARY_DEBT_ORIGINATION_REASON       = 11;
  static DICTIONARY_PERSON_TYPE                   = 12;
  static DICTIONARY_GENDER                        = 13;
  // static DICTIONARY_MARITAL_STATUS             = 14;
  static DICTIONARY_FAMILY_STATUS                 = 14; // WTF, this is not english
  static DICTIONARY_EDUCATION                     = 15;
  static DICTIONARY_IDENTITY_TYPE                 = 16;
  static DICTIONARY_PHONE_TYPE                    = 17;
  static DICTIONARY_PHONE_STATUS                  = 18;
  static DICTIONARY_REASON_FOR_STATUS_CHANGE      = 19;
  static DICTIONARY_PHONE_REASON_FOR_BLOCKING     = 20;
  static DICTIONARY_ADDRESS_TYPE                  = 21;
  static DICTIONARY_ADDRESS_STATUS                = 22;
  static DICTIONARY_ADDRESS_REASON_FOR_BLOCKING   = 23;
  static DICTIONARY_EMAIL_TYPE                    = 24;
  static DICTIONARY_EMAIL_REASON_FOR_BLOCKING     = 25;
  static DICTIONARY_REGIONS                       = 26;
  static DICTIONARY_DEBT_COMPONENTS               = 27;
  static DICTIONARY_CONTRACTOR_TYPE               = 28;
  static DICTIONARY_PORTFOLIO_DIRECTION           = 29;
  static DICTIONARY_PORTFOLIO_STATUS              = 30;
  static DICTIONARY_PORTFOLIO_STAGE               = 31;  // bloody EMPTY
  static DICTIONARY_CONTACT_PERSON_TYPE           = 32;
  static DICTIONARY_DOCUMENT_TYPE                 = 33;
  static DICTIONARY_DEBT_LIST_1                   = 34;
  static DICTIONARY_DEBT_LIST_2                   = 35;
  static DICTIONARY_DEBT_LIST_3                   = 36;
  static DICTIONARY_DEBT_LIST_4                   = 37;
  static DICTIONARY_WORK_TYPE                     = 38;
  static DICTIONARY_PROMISE_STATUS                = 39;
  static DICTIONARY_PAYMENT_STATUS                = 40;
  static DICTIONARY_PAYMENT_PURPOSE               = 41;
  static DICTIONARY_MESSAGE_TEMPLATE_TYPE         = 42;
  static DICTIONARY_ROLE_ENTITIES                 = 43;
  static DICTIONARY_PERSON_ROLE                   = 44;
  static DICTIONARY_SMS_STATUS                    = 45;
  static DICTIONARY_SMS_SENDER                    = 46;
  static DICTIONARY_ATTRIBUTE_TREE_TYPE           = 47;
  static DICTIONARY_CONTACT_TREE_TYPE             = 48;
  static DICTIONARY_CALL_REASON                   = 49;
  static DICTIONARY_CONTACT_TYPE                  = 50;
  static DICTIONARY_CONTACT_INPUT_MODE            = 51;
  static DICTIONARY_CONTACT_PROMISE_INPUT_MODE    = 52;
  static DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE = 53;
  static DICTIONARY_PROPERTY_TYPE                 = 54;
  static DICTIONARY_ENTITY_TYPE                   = 55;
  static DICTIONARY_VISIT_STATUS                  = 56;
  static DICTIONARY_VISIT_PURPOSE                 = 57;
  static DICTIONARY_CALL_CAMPAIGN_STATUS          = 58;
  static DICTIONARY_CALL_CAMPAIGN_TYPE            = 59;
  static DICTIONARY_DEBT_STAGE_CODE               = 60;
  static DICTIONARY_DEBTOR_STAGE_CODE             = 61;
  static DICTIONARY_DATA_LOAD_FORMAT              = 62;
  static DICTIONARY_EMAIL_FORMAT                  = 63;
  static DICTIONARY_EMAIL_SENDER                  = 64;
  static DICTIONARY_EMAIL_STATUS                  = 65;
  static DICTIONARY_SCHEDULE_EVENT_TYPE           = 67;
  static DICTIONARY_PERIOD_TYPE                   = 68;
  static DICTIONARY_OPERATOR_MODE_CODE            = 69;

  static USER_DICTIONARY_FETCH         = 'USER_DICTIONARY_FETCH';
  static USER_DICTIONARY_FETCH_SUCCESS = 'USER_DICTIONARY_FETCH_SUCCESS';
  static USER_DICTIONARY_FETCH_FAILURE = 'USER_DICTIONARY_FETCH_FAILURE';

  private isFetching: object = {};

  constructor(
    // private dataService: DataService,
    private store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService
  ) {}

  createRefreshAction(dictionaryId: number): SafeAction<IUserDictionaryAction> {
    return {
      type: UserDictionariesService.USER_DICTIONARY_FETCH,
      payload: { dictionaryId }
    };
  }

  getDictionary(id: number): Observable<IUserTerm[]> {
    return this.loadDictionaries([ id ], term => term).map(dictionaries => dictionaries[id]);
  }

  getDictionaries(ids: Array<number>): Observable<IUserDictionaries> {
    return this.loadDictionaries(ids, term => term);
  }

  getDictionaryAsOptions(id: number): Observable<IOption[]> {
    return this.loadDictionaries([ id ], term => ({ value: term.code, label: term.name })).map(dictionaries => dictionaries[id]);
  }

  getDictionariesAsOptions(ids: Array<number>): Observable<IUserDictionaryOptions> {
    return this.loadDictionaries(ids, term => ({ value: term.code, label: term.name }));
  }

  getDictionaryAsOptionsWithPermission(id: number, permissionName: string): Observable<IOption[]> {
    return combineLatest(
      this.getDictionaryAsOptions(id),
      this.userPermissionsService.bag()
    )
      .map(([options, valueBag]) => {
        if (valueBag && !valueBag.containsALL(permissionName)) {
          const allowedOptionsValues = (valueBag as ValueBag)
            .getStringValueAsArray(permissionName);
          // filter options with allowed options values
          options = options.filter(optionValue => allowedOptionsValues.includes(optionValue.value as any));
        }
        return options;
      });
  }

  /*
  private loadDictionary<T>(dictionaryId: number): Observable<T> {
    // log('id', dictionaryId);

    // If the dictionary is already being fetched, just wait for it
    // then reset `isFetching` to false
    if (this.isFetching[dictionaryId]) {
      // log('dictionary is being fetched:', dictionaryId);
      return this.state$
        .map(dictionaries => dictionaries[dictionaryId])
        .filter(Boolean)
        .do(dict => {
          // log('dictionary has been fetched:', dictionaryId);
          this.isFetching[dictionaryId] = false;
        });
    }

    return this.state$
      .map(dictionaries => dictionaries[dictionaryId])
      .switchMap((dictionary) => {
        // log('dictionary request:', dictionaryId);
        // The dictionary is in the store, just return it
        if (dictionary) {
          this.isFetching[dictionaryId] = false;
          return of(dictionary);
        }

        // If the dictionary is not found in the store, set `isFetching` to true,
        // fetch the dictionary, then reset `isFetching` to false
        this.isFetching[dictionaryId] = false;
        return this.read(dictionaryId)
            .do(terms => {
              // log('dictionary fetched:', dictionaryId);
              this.store.dispatch({
                type: UserDictionariesService.USER_DICTIONARY_FETCH_SUCCESS,
                payload: { dictionaryId, terms }
              });
            })
            .switchMap(_ => this.state$.map(dictionaries => dictionaries[dictionaryId]).filter(Boolean));
      });
  }
  */

  private loadDictionaries<T>(ids: Array<number>, transform: ITransformCallback<T>): Observable<{ [key: number]: Array<T> }> {

    // const dictionariesObs = ids.map(id => this.loadDictionary(id));
    // return combineLatest(dictionariesObs, of(ids))
    //   .map(([dictionaries, idss]) => {
    //     return idss.reduce((acc, id, i) => {
    //       const dictionary = dictionaries[i];
    //       return {
    //         ...acc,
    //         [id]: dictionary ? dictionary.map(transform) : null
    //       };
    //     }, {});
    //   })
    //   .filter(dictionaries => Object.keys(dictionaries).reduce((acc, key) => acc && !!dictionaries[key], true))
    //   .pipe(distinctUntilChanged());
      // .flatMap(dictionaries => {
        // return dictionaries.reduce((acc, dictionary, id) => {
        //   return {
        //     ...acc,
        //     [id]: dictionary.map(transform)
        //   };
        // }, {});
      // })

    return this.state$
      .pipe(
        tap(dictionaries => {
          ids.forEach(id => {
            if (!dictionaries[id] && !this.isFetching[id]) {
              this.isFetching[id] = true;
              // log('fetching id:', id);
              const action = this.createRefreshAction(id);
              this.store.dispatch(action);
            }
          });
        }),
        switchMap(dictionaries => of(ids.reduce((acc, id) => {
          const dictionary = dictionaries[id];
          return {
            ...acc,
            [id]: dictionary ? dictionary.map(transform) : null
          };
        }, {}))),
        filter(dictionaries => Object.keys(dictionaries).reduce((acc, key) => acc && !!dictionaries[key], true)),
        distinctUntilChanged(),
        tap(() => ids.forEach(id => this.isFetching[id] = false))
      );
      // NOTE: debug here
      // .tap(() => log('fetched:', ids.join(',')));
  }

  private get state$(): Observable<IUserDictionariesState> {
    return this.store.select(state => state.userDictionaries);
  }

  // private read(dictionaryId: number): Observable<IUserTerm[]> {
  //   return this.dataService.readAll('/lookup/dictionaries/{dictionaryId}/terms', { dictionaryId });
  // }
}
