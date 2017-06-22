import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IUserLanguagesResponse } from './user-languages.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserLanguagesService } from './user-languages.service';

@Injectable()
export class UserLanguagesEffects {
  @Effect()
  fetchConstants$ = this.actions
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
            this.notificationService.createErrorAction('user.languages.api.errors.fetch')
          ];
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IUserLanguagesResponse> {
    return this.gridService.read('/userlanguages');
  }
}
