import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import {
  IDictionary,
  IDictionariesState,
  ITerm,
} from './dictionaries.interface';

@Injectable()
export class DictionariesService {

  static DICTIONARIES_FETCH                     = 'DICTIONARIES_FETCH';
  static DICTIONARIES_FETCH_SUCCESS             = 'DICTIONARIES_FETCH_SUCCESS';
  static DICTIONARIES_CLEAR                     = 'DICTIONARIES_CLEAR';
  static DICTIONARY_CREATE                      = 'DICTIONARY_CREATE';
  static DICTIONARY_UPDATE                      = 'DICTIONARY_UPDATE';
  static DICTIONARY_DELETE                      = 'DICTIONARY_DELETE';
  static DICTIONARY_SELECT                      = 'DICTIONARY_SELECT';
  // static DICTIONARY_TRANSLATIONS_FETCH          = 'DICTIONARY_TRANSLATIONS_FETCH';
  // static DICTIONARY_TRANSLATIONS_FETCH_SUCCESS  = 'DICTIONARY_TRANSLATIONS_FETCH_SUCCESS';
  // static TERM_TRANSLATIONS_FETCH                = 'TERM_TRANSLATIONS_FETCH';
  // static TERM_TRANSLATIONS_FETCH_SUCCESS        = 'TERM_TRANSLATIONS_FETCH_SUCCESS';
  static TERM_TYPES_FETCH                       = 'TERM_TYPES_FETCH';
  static TERM_TYPES_FETCH_SUCCESS               = 'TERM_TYPES_FETCH_SUCCESS';
  static TERM_CREATE                            = 'TERM_CREATE';
  static TERM_UPDATE                            = 'TERM_UPDATE';
  static TERM_DELETE                            = 'TERM_DELETE';
  static TERM_SELECT                            = 'TERM_SELECT';
  static TERMS_FETCH                            = 'TERMS_FETCH';
  static TERMS_FETCH_SUCCESS                    = 'TERMS_FETCH_SUCCESS';
  static TERMS_PARENT_FETCH                     = 'TERMS_PARENT_FETCH';
  static TERMS_PARENT_FETCH_SUCCESS             = 'TERMS_PARENT_FETCH_SUCCESS';
  static TERMS_PARENT_CLEAR                     = 'TERMS_PARENT_CLEAR';
  static TERMS_CLEAR                            = 'TERMS_CLEAR';

  readonly state: Observable<IDictionariesState> = this.store.select(state => state.dictionaries);
  readonly selectedDictionary: Observable<IDictionary> = this.state.pipe(
    map(dictionaries => dictionaries.selectedDictionary),
    distinctUntilChanged(),
  );
  readonly selectedTerm: Observable<ITerm> = this.state.pipe(
    map(dictionaries => dictionaries.selectedTerm),
    distinctUntilChanged(),
  );
  readonly hasSelectedDictionary: Observable<boolean> = this.selectedDictionary.pipe(
    map(selectedDictionary => !!selectedDictionary),
  );
  readonly hasSelectedTerm: Observable<boolean> = this.selectedTerm.pipe(
    map(term => !!term),
  );
  readonly dictionaries: Observable<IDictionary[]> = this.state.pipe(
    map(dictionaries => dictionaries.dictionaries),
    distinctUntilChanged(),
  );
  readonly terms: Observable<ITerm[]> = this.state.pipe(
    map(dictionaries => dictionaries.terms),
    distinctUntilChanged(),
  );
  readonly parentTerms: Observable<ITerm[]> = this.state.pipe(
    map(dictionaries => dictionaries.parentTerms),
    distinctUntilChanged(),
  );
  readonly dropdownTerms: Observable<ITerm[]> = this.state.pipe(
    map(dictionaries => dictionaries.parentTerms),
    distinctUntilChanged(),
  );
  readonly dictionaryTermTypes: Observable<ITerm[]> = this.state.pipe(
    map(dictionaries => dictionaries.dictionaryTermTypes),
    distinctUntilChanged(),
  );

  constructor(
    private store: Store<IAppState>
  ) {}

  fetchDictionaries(): void {
    this.store.dispatch({ type: DictionariesService.DICTIONARIES_FETCH });
  }

  fetchTermTypes(): void {
    this.store.dispatch({ type: DictionariesService.TERM_TYPES_FETCH });
  }

  clearDictionaries(): void {
    this.store.dispatch({ type: DictionariesService.DICTIONARIES_CLEAR });
  }

  createDictionary(dictionary: IDictionary): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARY_CREATE,
      payload: {
        dictionary
      }
    });
  }

  updateDictionary(dictionary: IDictionary): void {
    this.store.dispatch({
      type: DictionariesService.DICTIONARY_UPDATE,
      payload: {
        dictionary,
      }
    });
  }

  deleteDictionary(): void {
    this.store.dispatch({ type: DictionariesService.DICTIONARY_DELETE });
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
    this.store.dispatch({ type: DictionariesService.TERMS_FETCH });
  }

  createTerm(term: ITerm): void {
    this.store.dispatch({
      type: DictionariesService.TERM_CREATE,
      payload: {
        term
      }
    });
  }

  updateTerm(term: ITerm): void {
    this.store.dispatch({
      type: DictionariesService.TERM_UPDATE,
      payload: {
        term,
      }
    });
  }

  deleteTerm(): void {
    return this.store.dispatch({ type: DictionariesService.TERM_DELETE });
  }

  clearTerms(): void {
    return this.store.dispatch({ type: DictionariesService.TERMS_CLEAR });
  }

  selectTerm(term: ITerm): void {
    return this.store.dispatch({
      type: DictionariesService.TERM_SELECT,
      payload: term
    });
  }

}
