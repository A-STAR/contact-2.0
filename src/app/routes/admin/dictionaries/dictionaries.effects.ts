import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';

import { IAppState } from '../../../core/state/state.interface';
import { IDictionary, ITerm } from './dictionaries.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../../core/data/data.service';
import { DictionariesService } from './dictionaries.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class DictionariesEffects {

  @Effect()
  fetchDictionaries$ = this.actions
    .ofType(DictionariesService.DICTIONARIES_FETCH)
    .switchMap(() => {
      return this.readDictionaries()
        .map(dictionaries => ({
          type: DictionariesService.DICTIONARIES_FETCH_SUCCESS,
          payload: {
            dictionaries
          }
        }))
        .catch(this.notificationsService.fetchError().entity('entities.dictionaries.gen.plural').callback());
    });

  @Effect()
  fetchDictionariesSuccess$ = this.actions
    .ofType(DictionariesService.DICTIONARIES_FETCH_SUCCESS)
    .map(() => ({
      type: DictionariesService.DICTIONARY_SELECT,
      payload: {
        dictionary: null
      }
    }));

  @Effect()
  createDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_CREATE)
    .switchMap((action: UnsafeAction) => {
      return this.createDictionary(action.payload.dictionary)
        .mergeMap(() => [
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
        ])
        .catch(this.notificationsService.createError().entity('entities.dictionaries.gen.singular').callback());
    });

  @Effect()
  updateDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(store => {
      const [action, state]: [UnsafeAction, IAppState] = store;
      const { code } = state.dictionaries.selectedDictionary;
      const { dictionary } = action.payload;
      return this.updateDictionary(code, dictionary)
        .mergeMap(() => [
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.updateError().entity('entities.dictionaries.gen.singular').callback());
    });

  @Effect()
  deleteDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const { code } = data[1].dictionaries.selectedDictionary;
      return this.deleteDictionary(code)
        .mergeMap(() => [
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.deleteError().entity('entities.dictionaries.gen.singular').callback());
    });

  @Effect()
  selectDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_SELECT)
    .switchMap((action: UnsafeAction) => ([
        {
          type: action.payload.dictionary ? DictionariesService.TERMS_FETCH : DictionariesService.TERMS_CLEAR,
          payload: action.payload.dictionary
        },
        {
          type: action.payload.dictionary ? DictionariesService.TERMS_PARENT_FETCH : DictionariesService.TERMS_PARENT_CLEAR,
          payload: action.payload.dictionary
        }
      ])
    );

  @Effect()
  fetchTermTypes$ = this.actions
    .ofType(DictionariesService.TERM_TYPES_FETCH)
    .switchMap(_ => {
      // NOTE: this is hardcoded to always remain the same
      return this.readTerms(UserDictionariesService.DICTIONARY_TERM_TYPES)
        .map((terms: any) => {
          return {
            type: DictionariesService.TERM_TYPES_FETCH_SUCCESS,
            payload: terms
          };
        });
    });

  @Effect()
  fetchTerms$ = this.actions
    .ofType(DictionariesService.TERMS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(store => {
      const state: IAppState = store[1];
      return state.dictionaries.selectedDictionary
        ? this.readTerms(state.dictionaries.selectedDictionary.code)
            .map((terms: any) => {
              return {
                type: DictionariesService.TERMS_FETCH_SUCCESS,
                payload: terms
              };
            })
            .catch(this.notificationsService.fetchError().entity('entities.terms.gen.plural').callback())
        : empty();
    });

  @Effect()
  fetchTermsSuccess$ = this.actions
    .ofType(DictionariesService.TERMS_FETCH_SUCCESS)
    .map(() => ({
      type: DictionariesService.TERM_SELECT,
      payload: null
    }));

  @Effect()
  fetchParentTerms$ = this.actions
    .ofType(DictionariesService.TERMS_PARENT_FETCH)
    .withLatestFrom(this.store)
    .switchMap(store => {
      const state: IAppState = store[1];
      const code = state.dictionaries.selectedDictionary.parentCode || state.dictionaries.selectedDictionary.code;
      return this.readTerms(code as number)
        .map((terms: any) => {
          return {
            type: DictionariesService.TERMS_PARENT_FETCH_SUCCESS,
            payload: terms
          };
        })
        .catch(this.notificationsService.fetchError().entity('entities.terms.gen.plural').callback());
    });

  @Effect()
  createTerm$ = this.actions
    .ofType(DictionariesService.TERM_CREATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [UnsafeAction, IAppState] = data;
      const { code } = store.dictionaries.selectedDictionary;
      return this.createTerm(code, action.payload.term)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.createError().entity('entities.terms.gen.singular').callback());
    });

  @Effect()
  updateTerm$ = this.actions
    .ofType(DictionariesService.TERM_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(store => {
      const [action, state]: [UnsafeAction, IAppState] = store;
      const selectedTerm = state.dictionaries.selectedTerm;
      const { code } = state.dictionaries.selectedDictionary;
      const { term } = action.payload;
      return this.updateTerm(code, selectedTerm.id, term)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.updateError().entity('entities.terms.gen.singular').callback());
    });

  @Effect()
  deleteTerm$ = this.actions
    .ofType(DictionariesService.TERM_DELETE)
    .withLatestFrom(this.store)
    .switchMap(store => {
      const state: IAppState = store[1];
      const { code } = state.dictionaries.selectedDictionary;
      return this.deleteTerm(code, state.dictionaries.selectedTerm.id)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.deleteError().entity('entities.terms.gen.singular').callback());
      });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private userDictionariesService: UserDictionariesService,
  ) {}

  private readDictionaries(): Observable<any> {
    return this.dataService.readAll('/dictionaries');
  }

  private createDictionary(dictionary: IDictionary): Observable<any> {
    return this.dataService.create('/dictionaries', {}, dictionary);
  }

  private updateDictionary(code: number, dictionary: IDictionary): Observable<any> {
    return this.dataService.update('/dictionaries/{code}', { code }, dictionary);
  }

  private deleteDictionary(code: number): Observable<any> {
    return this.dataService.delete('/dictionaries/{code}', { code });
  }

  private readTerms(code: string|number): Observable<any> {
    return this.dataService.readAll('/dictionaries/{code}/terms', { code });
  }

  private createTerm(code: number, term: ITerm): Observable<any> {
    return this.dataService.create('/dictionaries/{code}/terms', { code }, term);
  }

  private updateTerm(dictionaryCode: number, termId: number, term: ITerm): Observable<any> {

    return this.dataService.update('/dictionaries/{dictionaryCode}/terms/{termId}', { dictionaryCode, termId }, term);
  }

  private deleteTerm(code: number, termId: number): Observable<any> {
    return this.dataService.delete('/dictionaries/{code}/terms/{termId}', { code, termId });
  }
}
