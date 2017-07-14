import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';

import { IAppState } from '../state/state.interface';
import {
  IDictionary,
  IDictionariesState,
  DictionariesDialogActionEnum,
  ITerm,
  IDictionaryItem
} from './dictionaries.interface';

@Injectable()
export class DictionariesService {
  static DICTIONARY_CODES = {
    DICTIONARY_TERM_TYPES: 5,
    USERS_ACTIONS_TYPES: 4
  };
  static DICTIONARIES_FETCH         = 'DICTIONARIES_FETCH';
  static DICTIONARIES_FETCH_SUCCESS = 'DICTIONARIES_FETCH_SUCCESS';
  static DICTIONARIES_CLEAR         = 'DICTIONARIES_CLEAR';
  static DICTIONARY_TRANSLATIONS_CLEAR = 'DICTIONARY_TRANSLATIONS_CLEAR';
  static DICTIONARY_CREATE          = 'DICTIONARY_CREATE';
  static DICTIONARY_UPDATE          = 'DICTIONARY_UPDATE';
  static DICTIONARY_DELETE          = 'DICTIONARY_DELETE';
  static DICTIONARY_SELECT          = 'DICTIONARY_SELECT';
  static TRANSLATIONS_FETCH         = 'TRANSLATIONS_FETCH';
  static TERM_TRANSLATIONS_FETCH    = 'TERM_TRANSLATIONS_FETCH';
  static TERM_TRANSLATIONS_CLEAR    = 'TERM_TRANSLATIONS_CLEAR';
  static TRANSLATIONS_FETCH_SUCCESS = 'TRANSLATIONS_FETCH_SUCCESS';
  static TERM_TRANSLATIONS_FETCH_SUCCESS = 'TERM_TRANSLATIONS_FETCH_SUCCESS';
  static TERMS_FETCH                = 'TERMS_FETCH';
  static TERMS_FETCH_SUCCESS        = 'TERMS_FETCH_SUCCESS';
  static TERM_TYPES_FETCH           = 'TERM_TYPES_FETCH';
  static TERMS_TYPES_FETCH_SUCCESS  = 'TERMS_TYPES_FETCH_SUCCESS';
  static TERMS_CLEAR                = 'TERMS_CLEAR';
  static TERM_CREATE                = 'TERM_CREATE';
  static TERM_UPDATE                = 'TERM_UPDATE';
  static TERM_DELETE                = 'TERM_DELETE';
  static TERM_SELECT                = 'TERM_SELECT';
  static DICTIONARY_DIALOG_ACTION   = 'DICTIONARY_DIALOG_ACTION';
  static TERM_DIALOG_ACTION         = 'TERM_DIALOG_ACTION';

  constructor(private store: Store<IAppState>) {}

  get dictionariesByCode(): Observable<{ [index: number]: IDictionaryItem[] }> {
    return Observable.combineLatest(
      this.store.select(state => state.actionsLog.actionTypes),
      // TODO(a.poterenko) Need to fill
    ).map(([
             usersActionsTypes
    ]) => {
      return {
        [DictionariesService.DICTIONARY_CODES.USERS_ACTIONS_TYPES]: usersActionsTypes
      };
    }).distinctUntilChanged();
  }

  get state(): Observable<IDictionariesState> {
    return this.store
      .select(state => state.dictionaries)
      .distinctUntilChanged();
  }

  get selectedDictionary(): Observable<IDictionary> {
    return this.store
      .select(state => state.dictionaries.selectedDictionary)
      .distinctUntilChanged();
  }

  get selectedTerm(): Observable<ITerm> {
    return this.store
      .select(state => state.dictionaries.selectedTerm)
      .distinctUntilChanged();
  }

  get isSelectedDictionaryExist(): Observable<boolean> {
    return this.selectedDictionary.map(selectedDictionary => !!selectedDictionary);
  }

  get isSelectedTermExist(): Observable<boolean> {
    return this.selectedTerm.map(selectedTerm => !!selectedTerm);
  }

  get isSelectedDictionaryReady(): Observable<boolean> {
    return this.selectedDictionary.map(selectedDictionary => selectedDictionary && !!selectedDictionary.nameTranslations);
  }

  get isSelectedTermReady(): Observable<boolean> {
    return this.selectedTerm.map(selectedTerm => selectedTerm && !!selectedTerm.nameTranslations);
  }

  get dialogAction(): Observable<DictionariesDialogActionEnum> {
    return this.store
      .select(state => state.dictionaries.dialogAction)
      .distinctUntilChanged();
  }

  get dictionaries(): Observable<IDictionary[]> {
    return this.store
      .select(state => state.dictionaries.dictionaries)
      .distinctUntilChanged();
  }

  get terms(): Observable<ITerm[]> {
    return this.store
      .select(state => state.dictionaries.terms)
      .distinctUntilChanged();
  }

  get dictionaryTermTypes(): Observable<ITerm[]> {
    return this.store
      .select((state: IAppState) => state.dictionaries.dictionaryTermTypes)
      .distinctUntilChanged();
  }

  fetchDictionaries(): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARIES_FETCH
    });
  }

  clearDictionaries(): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARIES_CLEAR
    });
  }

  createDictionary(dictionary: IDictionary): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARY_CREATE,
      payload: {
        dictionary
      }
    });
  }

  updateDictionary(dictionary: IDictionary, deletedTranslations: Array<number>, updatedTranslations: Array<any>): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARY_UPDATE,
      payload: {
        dictionary,
        deletedTranslations,
        updatedTranslations
      }
    });
  }

  deleteDictionary(): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARY_DELETE
    });
  }

  selectDictionary(dictionary: IDictionary): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARY_SELECT,
      payload: {
        dictionary
      }
    });
  }

  fetchTerms(): void {
    this.store.dispatch({
      type: DictionariesService.TERMS_FETCH
    });
  }

  createTerm(term: ITerm): void {
    this.store.dispatch({
      type: DictionariesService.TERM_CREATE,
      payload: {
        term
      }
    });
  }

  updateTerm(term: ITerm, deletedTranslations: Array<number>, updatedTranslations: Array<any>): void {
    this.store.dispatch({
      type: DictionariesService.TERM_UPDATE,
      payload: {
        term,
        deletedTranslations,
        updatedTranslations
      }
    });
  }

  deleteTerm(): void {
    return this.store.dispatch({
      type: DictionariesService.TERM_DELETE,
    });
  }

  clearTerms(): void {
    return this.store.dispatch({
      type: DictionariesService.TERMS_CLEAR
    });
  }

  selectTerm(term: ITerm): void {
    return this.store.dispatch({
      type: DictionariesService.TERM_SELECT,
      payload: term
    });
  }

  setDictionaryDialogAction(dialogAction: DictionariesDialogActionEnum): void {
    return this.store.dispatch({
      type: DictionariesService.DICTIONARY_DIALOG_ACTION,
      payload: {
        dialogAction
      }
    });
  }

  setTermDialogAction(dialogAction: DictionariesDialogActionEnum): void {
    return this.store.dispatch({
      type: DictionariesService.TERM_DIALOG_ACTION,
      payload: {
        dialogAction
      }
    });
  }

  setDialogAddDictionaryAction(): void {
    this.setDictionaryDialogAction(DictionariesDialogActionEnum.DICTIONARY_ADD);
  }

  setDialogEditDictionaryAction(): void {
    this.setDictionaryDialogAction(DictionariesDialogActionEnum.DICTIONARY_EDIT);
  }

  setDialogRemoveDictionaryAction(): void {
    this.setDictionaryDialogAction(DictionariesDialogActionEnum.DICTIONARY_REMOVE);
  }

  setDialogAddTermAction(): void {
    this.setTermDialogAction(DictionariesDialogActionEnum.TERM_ADD);
  }

  setDialogEditTermAction(): void {
    this.setTermDialogAction(DictionariesDialogActionEnum.TERM_EDIT);
  }

  setDialogRemoveTermAction(): void {
    this.setTermDialogAction(DictionariesDialogActionEnum.TERM_REMOVE);
  }
}
