import { Action } from '@ngrx/store';

import { IDictionariesState } from './dictionaries.interface';

import { DictionariesService } from './dictionaries.service';

const defaultState: IDictionariesState = {
  dictionaries: [],
  selectedDictionaryCode: null,
  terms: [],
  dictionaryTermTypes: null,
  selectedTermId: null,
  dialogAction: null
};

export function dictionariesReducer(state: IDictionariesState = defaultState, action: Action): IDictionariesState {
  switch (action.type) {
    case DictionariesService.DICTIONARIES_FETCH_SUCCESS:
      return {
        ...state,
        dictionaries: action.payload.dictionaries
      };
    case DictionariesService.DICTIONARY_SELECT:
      return {
        ...state,
        selectedDictionaryCode: action.payload.dictionaryCode
      };
    case DictionariesService.DICTIONARIES_CLEAR:
      return {
        ...state,
        dictionaries: [],
        selectedDictionaryCode: null
      };
    case DictionariesService.TERMS_FETCH_SUCCESS:
      return {
        ...state,
        terms: action.payload.terms,
        dictionaryTermTypes: action.payload.dictionaryTermTypes
      };
    case DictionariesService.TERM_SELECT:
      return {
        ...state,
        selectedTermId: action.payload.termId
      };
    case DictionariesService.TERMS_CLEAR:
      return {
        ...state,
        terms: [],
        selectedTermId: null
      };
    case DictionariesService.DICTIONARY_DIALOG_ACTION:
      return {
        ...state,
        dialogAction: action.payload.dialogAction
      };
    default:
      return state;
  }
};
