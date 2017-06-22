import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAppState } from '../../state/state.interface';
import { IUserLanguage, IUserLanguageOption, IUserLanguagesState } from './user-languages.interface';

@Injectable()
export class UserLanguagesService {
  static USER_LANGUAGES_FETCH         = 'USER_LANGUAGES_FETCH';
  static USER_LANGUAGES_FETCH_SUCCESS = 'USER_LANGUAGES_FETCH_SUCCESS';
  static USER_LANGUAGES_FETCH_FAILURE = 'USER_LANGUAGES_FETCH_FAILURE';

  constructor(private store: Store<IAppState>) {}

  get isResolved(): Observable<boolean> {
    return this.state.map(state => state.isResolved);
  }

  createRefreshAction(): Action {
    return {
      type: UserLanguagesService.USER_LANGUAGES_FETCH
    };
  }

  refresh(): void {
    const action = this.createRefreshAction();
    this.store.dispatch(action);
  }

  get languages(): Observable<Array<IUserLanguage>> {
    return this.state.map(state => state.languages);
  }

  get languageOptions(): Observable<Array<IUserLanguageOption>> {
    return this.languages
      .map(languages => languages.map(language => ({
        label: language.name,
        value: language.id
      })));
  }

  get userLanguages(): Observable<IUserLanguage[]> {
    return this.store
      .select((state: IAppState) => state.userLanguages.languages)
      .distinctUntilChanged();
  }

  private get state(): Observable<IUserLanguagesState> {
    return this.store.select(state => state.userLanguages);
  }
}
