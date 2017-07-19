import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserLanguagesResponse } from './user-languages.interface';

import { DataService } from '../../data/data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserLanguagesService } from './user-languages.service';

@Injectable()
export class UserLanguagesEffects {
  @Effect()
  fetchLanguages$ = this.actions
    .ofType(UserLanguagesService.USER_LANGUAGES_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map((response: IUserLanguagesResponse) => {
          return {
            type: UserLanguagesService.USER_LANGUAGES_FETCH_SUCCESS,
            payload: {
              data: response.languages
            }
          };
        })
        .catch(() => {
          return [
            {
              type: UserLanguagesService.USER_LANGUAGES_FETCH_FAILURE
            },
            this.notificationService.error('errors.default.read').entity('entities.user.languages.gen.plural').action()
          ];
        });
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserLanguagesResponse> {
    return this.dataService.read('/userlanguages');
  }
}
