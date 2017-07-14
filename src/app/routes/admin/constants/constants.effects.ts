import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IConstantsResponse } from './constants.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ConstantsService } from './constants.service';

import { ResponseError } from '../../../core/error/response-error';

@Injectable()
export class ConstantsEffects {

  @Effect()
  fetchConstants$ = this.actions
    .ofType(ConstantsService.CONSTANT_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map((response: IConstantsResponse) => {
          return {
            type: ConstantsService.CONSTANT_FETCH_SUCCESS,
            payload: response.constants
          };
        })
        .catch(error => {
          throw new ResponseError(error, 'constants.fetch');
        });
    });

  constructor(
    private actions: Actions,
    // private store: Store<IAppState>,
    private dataService: DataService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IConstantsResponse> {
    return this.dataService.read('/constants');
  }
}
