import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../state/state.interface';
import {
  IDictionariesState,
  DictionariesDialogActionEnum,
  IDictionaryCreateRequest,
  IDictionaryUpdateRequest
} from './dictionaries.interface';

@Injectable()
export class DictionariesService {
  static DICTIONARIES_FETCH         = 'DICTIONARIES_FETCH';
  static DICTIONARIES_FETCH_SUCCESS = 'DICTIONARIES_FETCH_SUCCESS';
  static DICTIONARIES_CLEAR         = 'DICTIONARIES_CLEAR';
  static DICTIONARY_CREATE          = 'DICTIONARY_CREATE';
  static DICTIONARY_UPDATE          = 'DICTIONARY_UPDATE';
  static DICTIONARY_DELETE          = 'DICTIONARY_DELETE';
  static DICTIONARY_SELECT          = 'DICTIONARY_SELECT';
  static TERMS_FETCH                = 'TERMS_FETCH';
  static TERMS_FETCH_SUCCESS        = 'TERMS_FETCH_SUCCESS';
  static TERMS_CLEAR                = 'TERMS_CLEAR';
  static TERM_CREATE                = 'TERM_CREATE';
  static TERM_UPDATE                = 'TERM_UPDATE';
  static TERM_DELETE                = 'TERM_DELETE';
  static TERM_SELECT                = 'TERM_SELECT';
  static DICTIONARY_DIALOG_ACTION   = 'DICTIONARY_DIALOG_ACTION';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IDictionariesState> {
    return this.store
      .select(state => state.dictionaries)
      .filter(Boolean);
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

  createDictionary(dictionary: IDictionaryCreateRequest): void {
    return this.store.dispatch({
      type: DictionariesService.DICTIONARY_CREATE,
      payload: {
        dictionary
      }
    });
  }

  updateDictionary(dictionary: IDictionaryUpdateRequest): void {
    return this.store.dispatch({
      type: DictionariesService.DICTIONARY_UPDATE,
      payload: {
        dictionary
      }
    });
  }

  deleteDictionary(): void {
    return this.store.dispatch({
      type: DictionariesService.DICTIONARY_DELETE
    });
  }

  selectDictionary(dictionaryId: number): void {
    return this.store.dispatch({
      type: DictionariesService.DICTIONARY_SELECT,
      payload: {
        dictionaryId
      }
    });
  }

  setDialogAction(dialogAction: DictionariesDialogActionEnum): void {
    return this.store.dispatch({
      type: DictionariesService.DICTIONARY_DIALOG_ACTION,
      payload: {
        dialogAction
      }
    });
  }
}
