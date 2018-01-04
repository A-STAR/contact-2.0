import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';

import { IAppState } from '../../../core/state/state.interface';
import { DictionariesDialogActionEnum, IDictionary, ITerm } from './dictionaries.interface';
import { IEntityTranslation } from '../../../core/entity/translations/entity-translations.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DataService } from '../../../core/data/data.service';
import { DictionariesService } from './dictionaries.service';
import { EntityTranslationsService } from '../../../core/entity/translations/entity-translations.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class DictionariesEffects {

  @Effect()
  fetchDictionaries$ = this.actions
    .ofType(DictionariesService.DICTIONARIES_FETCH)
    .switchMap((action: UnsafeAction) => {
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
      const [_, store]: [UnsafeAction, IAppState] = data;
      const { code } = store.dictionaries.selectedDictionary;
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
  onTermDialogAction$ = this.actions
    .ofType(DictionariesService.TERM_DIALOG_ACTION)
    .switchMap((action: UnsafeAction) => {
        return [DictionariesDialogActionEnum.TERM_ADD, DictionariesDialogActionEnum.TERM_EDIT]
          .includes(action.payload.dialogAction)
          ? [].concat(action.payload.dialogAction === DictionariesDialogActionEnum.TERM_EDIT
                        ? { type: DictionariesService.TERM_TRANSLATIONS_FETCH, payload: action.payload }
                        : [])
          : [{ type: DictionariesService.TERM_TRANSLATIONS_CLEAR }];
      }
    );

  @Effect()
  fetchTermTypes$ = this.actions
    .ofType(DictionariesService.TERM_TYPES_FETCH)
    .switchMap(data => {
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
  fetchDictionaryTranslations$ = this.actions
    .ofType(DictionariesService.TRANSLATIONS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [UnsafeAction, IAppState] = data;
      return this.entityTranslationsService.readDictNameTranslations(store.dictionaries.selectedDictionary.id)
        .map((translations: IEntityTranslation[]) => {
          return {
            type: DictionariesService.TRANSLATIONS_FETCH_SUCCESS,
            payload: translations
          };
        });
    });

  @Effect()
  fetchTermTranslations$ = this.actions
    .ofType(DictionariesService.TERM_TRANSLATIONS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [UnsafeAction, IAppState] = data;
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
      const [_, store]: [UnsafeAction, IAppState] = data;
      return store.dictionaries.selectedDictionary
        ? this.readTerms(store.dictionaries.selectedDictionary.code)
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
    .switchMap(data => {
      const [_, store]: [UnsafeAction, IAppState] = data;
      const code = store.dictionaries.selectedDictionary.parentCode || store.dictionaries.selectedDictionary.code;
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
          {
            type: DictionariesService.TERM_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.createError().entity('entities.terms.gen.singular').callback());
    });

  @Effect()
  updateTerm$ = this.actions
    .ofType(DictionariesService.TERM_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [UnsafeAction, IAppState] = data;
      const selectedTerm = store.dictionaries.selectedTerm;
      const { code } = store.dictionaries.selectedDictionary;
      const { term, updatedTranslations, deletedTranslations } = action.payload;
      return this.updateTerm(code, selectedTerm.id, term, deletedTranslations, updatedTranslations)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.TERM_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
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
      const [_, state]: [UnsafeAction, IAppState] = store;
      const { code } = state.dictionaries.selectedDictionary;
      return this.deleteTerm(code, state.dictionaries.selectedTerm.id)
        .mergeMap(() => [
          {
            type: DictionariesService.TERMS_FETCH
          },
          {
            type: DictionariesService.TERM_DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          },
          this.userDictionariesService.createRefreshAction(code)
        ])
        .catch(this.notificationsService.deleteError().entity('entities.terms.gen.singular').callback());
      });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private entityTranslationsService: EntityTranslationsService,
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

  private updateTerm(
    dictionaryCode: number,
    termId: number,
    term: ITerm,
    deletedTranslations: Array<number>,
    updatedTranslations: Array<IEntityTranslation>,
  ): Observable<any> {
    const data = {
      ...term,
      name: [
        ...updatedTranslations.map(translation => ({ languageId: translation.languageId, value: translation.value })),
        ...deletedTranslations.map(translation => ({ languageId: translation, value: null }))
      ]
    };
    return this.dataService.update('/dictionaries/{dictionaryCode}/terms/{termId}', { dictionaryCode, termId }, data);
  }

  private deleteTerm(code: number, termId: number): Observable<any> {
    return this.dataService.delete('/dictionaries/{code}/terms/{termId}', { code, termId });
  }
}
