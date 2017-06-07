import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../state/state.interface';
import { IDictionaryCreateRequest, IDictionaryUpdateRequest, ITerm } from './dictionaries.interface';

import { DictionariesService } from './dictionaries.service';
import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DictionariesEffects {

  @Effect()
  fetchDictionaries$ = this.actions
    .ofType(DictionariesService.DICTIONARIES_FETCH)
    .switchMap((action: Action) => {
      return this.readDictionaries()
        .map(response => ({
          type: DictionariesService.DICTIONARIES_FETCH_SUCCESS,
          payload: {
            dictionaries: response.dictionaries
          }
        }))
        .catch(() => {
          this.notificationsService.error('dictionaries.dictionaries.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  createDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_CREATE)
    .switchMap((action: Action) => {
      return this.createDictionary(action.payload.dictionary)
        .mergeMap(data => Observable.from([
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('dictionaries.dictionaries.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  updateDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.updateDictionary(store.dictionaries.selectedDictionaryCode, action.payload.dictionary)
        .mergeMap(() => Observable.from([
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('dictionaries.dictionaries.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  deleteDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteDictionary(store.dictionaries.selectedDictionaryCode)
        .mergeMap(() => Observable.from([
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_SELECT,
            payload: {
              dictionaryCode: null
            }
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('dictionaries.dictionaries.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  selectDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_SELECT)
    .switchMap(action => {
      return action.payload.organizationId ?
        Observable.of({
          type: DictionariesService.DICTIONARIES_FETCH
        }) :
        Observable.of({
          type: DictionariesService.DICTIONARIES_CLEAR
        });
    });

  @Effect()
  fetchTerms$ = this.actions
    .ofType(DictionariesService.TERMS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readTerms(store.dictionaries.selectedDictionaryCode)
        .map(response => ({
          type: DictionariesService.TERMS_FETCH_SUCCESS,
          payload: {
            terms: response.terms
          }
        }))
        .catch(() => {
          this.notificationsService.error('dictionaries.terms.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  createTerm$ = this.actions
    .ofType(DictionariesService.TERM_CREATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.createTerm(store.dictionaries.selectedDictionaryCode, action.payload.term)
        .mergeMap(() => Observable.from([
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('dictionaries.terms.messages.errors.create');
          return null;
        });
    });

  @Effect()
  updateTerm$ = this.actions
    .ofType(DictionariesService.TERM_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.updateTerm(
        store.dictionaries.selectedDictionaryCode,
        store.dictionaries.selectedTermId,
        action.payload.term
      )
        .mergeMap(() => Observable.from([
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('dictionaries.terms.messages.errors.update');
          return null;
        });
    });

  @Effect()
  deleteTerm$ = this.actions
    .ofType(DictionariesService.TERM_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteTerm(store.dictionaries.selectedDictionaryCode, store.dictionaries.selectedTermId)
        .mergeMap(() => Observable.from([
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('dictionaries.terms.messages.errors.delete');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private readDictionaries(): Observable<any> {
    return this.gridService.read('/api/dictionaries');
  }

  private createDictionary(dictionary: IDictionaryCreateRequest): Observable<any> {
    return this.gridService.create('/api/dictionaries', {}, dictionary);
  }

  private updateDictionary(dictionaryCode: string, dictionary: IDictionaryUpdateRequest): Observable<any> {
    return this.gridService.update('/api/dictionaries/{dictionaryCode}', { dictionaryCode }, dictionary);
  }

  private deleteDictionary(dictionaryCode: string): Observable<any> {
    // TODO: double check
    return this.gridService.delete('/api/dictionaries/{dictionaryCode}', { dictionaryCode });
  }

  private readTerms(dictionaryCode: string): Observable<any> {
    return this.gridService.read('/api/dictionaries/{dictionaryCode}/terms', { dictionaryCode });
  }

  private createTerm(dictionaryCode: string, term: ITerm): Observable<any> {
    return this.gridService.create('/api/dictionaries/{dictionaryCode}/terms', { dictionaryCode }, term);
  }

  private updateTerm(dictionaryCode: string, termId: number, term: ITerm): Observable<any> {
    return this.gridService.create('/api/dictionaries/{dictionaryCode}/terms/{termId}', { dictionaryCode, termId }, term);
  }

  private deleteTerm(dictionaryCode: string, termId: number): Observable<any> {
    return this.gridService.delete('/api/dictionaries/{code}/terms/{termId}', { dictionaryCode, termId });
  }
}
