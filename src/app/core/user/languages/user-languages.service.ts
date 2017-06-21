import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IAppState } from '../../state/state.interface';
import { IUserLanguage, IUserLanguageOption, IUserLanguagesState } from './user-languages.interface';

@Injectable()
export class UserLanguagesService {
  static USER_LANGUAGES_FETCH         = 'USER_LANGUAGES_FETCH';
  static USER_LANGUAGES_FETCH_SUCCESS = 'USER_LANGUAGES_FETCH_SUCCESS';

  constructor(private store: Store<IAppState>) {}

  get isResolved(): Observable<boolean> {
    return this.state.map(state => state.languages.length > 0);
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

  getLanguages(): Observable<Array<IUserLanguage>> {
    return this.state.map(state => state.languages);
  }

  getLanguageOptions(): Observable<Array<IUserLanguageOption>> {
    return this.getLanguages()
      .map(languages => languages.map(language => ({
        label: language.name,
        value: language.id
      })));
  }

  private get state(): Observable<IUserLanguagesState> {
    return this.store.select('userLanguages');
  }
}
