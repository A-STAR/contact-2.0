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

  private _languages: Array<IUserLanguage>;

  constructor(private store: Store<IAppState>) {
    this.languages$.subscribe(languages => this._languages = languages);
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
    return this.getLanguages();
  }

  get languageOptions(): Observable<Array<IUserLanguageOption>> {
    return this.getLanguages().map(languages => languages.map(language => ({ label: language.name, value: language.id })));
  }

  private getLanguages(): Observable<Array<IUserLanguage>> {
    if (!this._languages) {
      this.refresh();
    }

    return this.languages$
      .filter(Boolean)
      .distinctUntilChanged();
  }

  private get languages$(): Observable<Array<IUserLanguage>> {
    return this.store.select(state => state.userLanguages.languages);
  }
}
