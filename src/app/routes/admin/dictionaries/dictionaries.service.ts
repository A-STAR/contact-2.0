import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { IAppState } from '../../../core/state/state.interface';
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

  constructor(
    private store: Store<IAppState>
  ) {}

  get state(): Observable<IDictionariesState> {
    return this.store.select(state => state.dictionaries);
  }

  get selectedDictionary(): Observable<IDictionary> {
    return this.state.map(dictionaries => dictionaries.selectedDictionary)
      .pipe(distinctUntilChanged());
  }

  get selectedTerm(): Observable<ITerm> {
    return this.state.map(dictionaries => dictionaries.selectedTerm)
      .pipe(distinctUntilChanged());
  }

  get hasSelectedDictionary(): Observable<boolean> {
    return this.selectedDictionary.map(selectedDictionary => !!selectedDictionary);
  }

  get hasSelectedTerm(): Observable<boolean> {
    return this.selectedTerm.map(term => !!term);
  }

  get dictionaries(): Observable<IDictionary[]> {
    return this.state.map(dictionaries => dictionaries.dictionaries)
      .pipe(distinctUntilChanged());
  }

  get terms(): Observable<ITerm[]> {
    return this.state.map(dictionaries => dictionaries.terms)
      .pipe(distinctUntilChanged());
  }

  get parentTerms(): Observable<ITerm[]> {
    return this.state.map(dictionaries => dictionaries.parentTerms)
      .pipe(distinctUntilChanged());
  }

  get dropdownTerms(): Observable<ITerm[]> {
    return this.state.map(dictionaries => dictionaries.parentTerms)
      .pipe(distinctUntilChanged());
  }

  get dictionaryTermTypes(): Observable<ITerm[]> {
    return this.state.map(dictionaries => dictionaries.dictionaryTermTypes)
      .pipe(distinctUntilChanged());
  }

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
    console.log(dictionary);
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
