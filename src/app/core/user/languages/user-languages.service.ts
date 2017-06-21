import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IAppState } from '../../state/state.interface';
import { IUserLanguage, IUserLanguageOption, IUserLanguagesResponse, IUserLanguagesState } from './user-languages.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class UserLanguagesService {
  static USER_LANGUAGES_FETCH         = 'USER_LANGUAGES_FETCH';
  static USER_LANGUAGES_FETCH_SUCCESS = 'USER_LANGUAGES_FETCH_SUCCESS';

  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserLanguagesService.USER_LANGUAGES_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map((response: IUserLanguagesResponse) => this.createFetchSuccessAction(response.languages))
        .catch(() => ([
          // TODO(d.maltsev): i18n
          this.notificationService.createErrorAction('constants.api.errors.fetch')
        ]));
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationService: NotificationsService,
    private router: Router,
    private store: Store<IAppState>
  ) {}

  preload(): Observable<boolean> {
    return this.read()
      .flatMap((response: IUserLanguagesResponse) => {
        const action = this.createFetchSuccessAction(response.languages);
        this.store.dispatch(action);
        return this.state
          .map(state => state.languages.length > 0)
          .filter(hasData => hasData)
          .take(1);
      })
      .catch(error => {
        // TODO(d.maltsev): i18n
        this.notificationService.error('constants.api.errors.fetch');
        this.router.navigate(['/']);
        throw error;
      });
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

  createRefreshAction(): Action {
    return {
      type: UserLanguagesService.USER_LANGUAGES_FETCH
    };
  }

  private createFetchSuccessAction(data: Array<IUserLanguage>): Action {
    return {
      type: UserLanguagesService.USER_LANGUAGES_FETCH_SUCCESS,
      payload: { data }
    };
  }

  private get state(): Observable<IUserLanguagesState> {
    return this.store.select('userLanguages');
  }

  private read(): Observable<IUserLanguagesResponse> {
    return this.gridService.read('/userlanguages');
  }
}
