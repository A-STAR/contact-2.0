import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../state/state.interface';
import { DictionariesDialogActionEnum, IDictionary, ITerm } from './dictionaries.interface';
import { IEntityTranslation } from '../entity/translations/entity-translations.interface';

import { DataService } from '../data/data.service';
import { DictionariesService } from './dictionaries.service';
import { EntityTranslationsService } from '../entity/translations/entity-translations.service';
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
            dictionaries: response.dictNames
          }
        }))
        .catch(() => ([
          this.notificationsService.createErrorAction('dictionaries.messages.errors.fetch')
        ]));
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
    .switchMap((action: Action) => {
      return this.createDictionary(action.payload.dictionary)
        .mergeMap(() => [
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => ([
          this.notificationsService.createErrorAction('dictionaries.messages.errors.create')
        ]));
    });

  @Effect()
  updateDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      const selectedDictionary = store.dictionaries.selectedDictionary;
      const { dictionary, updatedTranslations, deletedTranslations } = action.payload;
      return this.updateDictionary(selectedDictionary.code, selectedDictionary.id, dictionary, deletedTranslations, updatedTranslations)
        .mergeMap(() => [
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => ([
          this.notificationsService.createErrorAction('dictionaries.messages.errors.update')
        ]));
    });

  @Effect()
  deleteDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteDictionary(store.dictionaries.selectedDictionary.code)
        .mergeMap(() => [
          {
            type: DictionariesService.DICTIONARIES_FETCH
          },
          {
            type: DictionariesService.DICTIONARY_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => ([
          this.notificationsService.createErrorAction('dictionaries.messages.errors.delete')
        ]));
    });

  @Effect()
  selectDictionary$ = this.actions
    .ofType(DictionariesService.DICTIONARY_SELECT)
    .switchMap(action => ([
        {
          type: action.payload.dictionary ? DictionariesService.TERMS_FETCH : DictionariesService.TERMS_CLEAR,
          payload: action.payload.dictionary
        }
      ])
    );

  @Effect()
  onDictionaryDialogAction$ = this.actions
    .ofType(DictionariesService.DICTIONARY_DIALOG_ACTION)
    .switchMap(action => {
        return [DictionariesDialogActionEnum.DICTIONARY_ADD, DictionariesDialogActionEnum.DICTIONARY_EDIT]
          .includes(action.payload.dialogAction) ? [
          {
            type: DictionariesService.TERM_TYPES_FETCH
          },
          {
            type: DictionariesService.TRANSLATIONS_FETCH
          }
        ] : [
          {
            type: DictionariesService.DICTIONARY_TRANSLATIONS_CLEAR
          }
        ];
      }
    );

  @Effect()
  onTermDialogAction$ = this.actions
    .ofType(DictionariesService.TERM_DIALOG_ACTION)
    .switchMap(action => {
        return [DictionariesDialogActionEnum.TERM_ADD, DictionariesDialogActionEnum.TERM_EDIT]
          .includes(action.payload.dialogAction) ? [
          {
            type: DictionariesService.TERM_TRANSLATIONS_FETCH,
            payload: action.payload
          }
        ] : [
          {
            type: DictionariesService.TERM_TRANSLATIONS_CLEAR
          }
        ];
      }
    );

  @Effect()
  fetchTermTypes$ = this.actions
    .ofType(DictionariesService.TERM_TYPES_FETCH)
    .switchMap(data => {
      return this.readTerms(DictionariesService.DICTIONARY_CODES.DICTIONARY_TERM_TYPES)
        .map((response: any) => {
          return {
            type: DictionariesService.TERMS_TYPES_FETCH_SUCCESS,
            payload: response.terms
          };
        });
    });


  @Effect()
  fetchDictionaryTranslations$ = this.actions
    .ofType(DictionariesService.TRANSLATIONS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.entityTranslationsService.readDictNameTranslations(store.dictionaries.selectedDictionary.id)
        .map((response: IEntityTranslation[]) => {
          return {
            type: DictionariesService.TRANSLATIONS_FETCH_SUCCESS,
            payload: response.map((entityTranslation: IEntityTranslation) => {
              return {
                value: entityTranslation.languageId,
                context: { translation: entityTranslation.value }
              };
            })
          };
        });
    });

  @Effect()
  fetchTermTranslations$ = this.actions
    .ofType(DictionariesService.TERM_TRANSLATIONS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.entityTranslationsService.readTermNameTranslations(store.dictionaries.selectedTerm.id)
        .map((response: IEntityTranslation[]) => {
          return {
            type: DictionariesService.TERM_TRANSLATIONS_FETCH_SUCCESS,
            payload: response.map(entityTranslation => ({
              value: entityTranslation.languageId,
              context: { translation: entityTranslation.value }
            }))
          };
        });
    });

  @Effect()
  fetchTerms$ = this.actions
    .ofType(DictionariesService.TERMS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;

      return store.dictionaries.selectedDictionary
        ? this.readTerms(store.dictionaries.selectedDictionary.code)
          .map((response: any) => {
            return {
              type: DictionariesService.TERMS_FETCH_SUCCESS,
              payload: response.terms
            };
          })
          .catch(() => ([
            this.notificationsService.createErrorAction('terms.messages.errors.fetch')
          ]))
        : Observable.empty();
    });

  @Effect()
  fetchTermsSuccess$ = this.actions
    .ofType(DictionariesService.TERMS_FETCH_SUCCESS)
    .map(() => ({
      type: DictionariesService.TERM_SELECT,
      payload: null
    }));

  @Effect()
  createTerm$ = this.actions
    .ofType(DictionariesService.TERM_CREATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.createTerm(store.dictionaries.selectedDictionary.code, action.payload.term)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.TERM_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => ([
          this.notificationsService.createErrorAction('terms.messages.errors.create')
        ]));
    });

  @Effect()
  updateTerm$ = this.actions
    .ofType(DictionariesService.TERM_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      const selectedTerm = store.dictionaries.selectedTerm;
      const selectedDictionary = store.dictionaries.selectedDictionary;
      const { term, updatedTranslations, deletedTranslations } = action.payload;
      return this.updateTerm(selectedDictionary.code, selectedTerm.id, term, deletedTranslations, updatedTranslations)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.TERM_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => ([
          this.notificationsService.createErrorAction('term.messages.errors.update')
        ]));
    });

  @Effect()
  deleteTerm$ = this.actions
    .ofType(DictionariesService.TERM_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteTerm(store.dictionaries.selectedDictionary.code, store.dictionaries.selectedTerm.id)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.TERM_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(() => ([
          this.notificationsService.createErrorAction('terms.messages.errors.delete')
        ]));
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private entityTranslationsService: EntityTranslationsService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private readDictionaries(): Observable<any> {
    return this.dataService.read('/api/dictionaries');
  }

  private createDictionary(dictionary: IDictionary): Observable<any> {
    return this.dataService.create('/api/dictionaries', {}, dictionary);
  }

  private updateDictionary(
    dictionaryCode: number,
    dictionaryId: number,
    dictionary: IDictionary,
    deletedTranslations: Array<number>,
    updatedTranslations: Array<IEntityTranslation>,
  ): Observable<any> {
    return Observable.forkJoin([
      this.dataService.update('/api/dictionaries/{dictionaryCode}', { dictionaryCode }, dictionary),
      this.entityTranslationsService.saveDictNameTranslations(dictionaryId, updatedTranslations),
      this.entityTranslationsService.deleteDictNameTranslation(dictionaryId, deletedTranslations)
    ]);
  }

  private deleteDictionary(dictionaryCode: number): Observable<any> {
    return this.dataService.delete('/api/dictionaries/{dictionaryCode}', { dictionaryCode });
  }

  private readTerms(dictionaryCode: string|number): Observable<any> {
    return this.dataService.read('/api/dictionaries/{dictionaryCode}/terms', { dictionaryCode });
  }

  private createTerm(dictionaryCode: number, term: ITerm): Observable<any> {
    return this.dataService.create('/api/dictionaries/{dictionaryCode}/terms', { dictionaryCode }, term);
  }

  private updateTerm(
    dictionaryCode: number,
    termId: number,
    term: ITerm,
    deletedTranslations: Array<number>,
    updatedTranslations: Array<IEntityTranslation>,
  ): Observable<any> {
    return Observable.forkJoin([
      this.dataService.update('/api/dictionaries/{dictionaryCode}/terms/{termId}', { dictionaryCode, termId }, term),
      this.entityTranslationsService.saveTermNameTranslations(termId, updatedTranslations),
      this.entityTranslationsService.deleteTermNameTranslation(termId, deletedTranslations)
    ]);
  }

  private deleteTerm(dictionaryCode: number, termId: number): Observable<any> {
    return this.dataService.delete('/api/dictionaries/{dictionaryCode}/terms/{termId}', { dictionaryCode, termId });
  }
}
