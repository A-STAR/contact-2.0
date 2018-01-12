import { IDictionariesState } from './dictionaries.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import { DictionariesService } from './dictionaries.service';

export const defaultState: IDictionariesState = {
  dictionaries: [],
  selectedDictionary: null,
  selectedTerm: null,
  terms: [],
  parentTerms: [],
  dictionaryTermTypes: null,
};

export function reducer(state: IDictionariesState = defaultState, action: UnsafeAction): IDictionariesState {
  switch (action.type) {

    case DictionariesService.DICTIONARIES_FETCH_SUCCESS:
      return {
        ...state,
        dictionaries: action.payload.dictionaries
      };

    case DictionariesService.DICTIONARY_SELECT:
      return {
        ...state,
        selectedDictionary: action.payload.dictionary
      };

    case DictionariesService.DICTIONARIES_CLEAR:
      return {
        ...state,
        dictionaries: [],
        selectedDictionary: null
      };

    case DictionariesService.TERMS_FETCH_SUCCESS:
      return {
        ...state,
        terms: action.payload
      };

    case DictionariesService.TERMS_PARENT_FETCH_SUCCESS:
      return {
        ...state,
        parentTerms: action.payload
      };

    case DictionariesService.TERMS_PARENT_CLEAR: {
      return {
        ...state,
        parentTerms: []
      };
    }

    case DictionariesService.TERM_TYPES_FETCH_SUCCESS: {
      return {
        ...state,
        dictionaryTermTypes: action.payload
      };
    }

    case DictionariesService.TERM_SELECT:
      return {
        ...state,
        selectedTerm: action.payload
      };

    case DictionariesService.TERMS_CLEAR:
      return {
        ...state,
        terms: [],
        selectedTerm: null
      };

    default:
      return state;
  }
}
