import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';

import { IConstantsResponse } from './constants.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ConstantsService } from './constants.service';

@Injectable()
export class ConstantsEffects {

  @Effect()
  fetchConstants$ = this.actions
    .ofType(ConstantsService.CONSTANT_FETCH)
    .switchMap((action: Action) => {
      return this.dataService.read('/constants')
        .map((response: IConstantsResponse) => {
          return {
            type: ConstantsService.CONSTANT_FETCH_SUCCESS,
            payload: response.constants
          };
        })
        .catch(this.notificationService.error('errors.default.read').entity('entities.constants.gen.plural').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}
}
