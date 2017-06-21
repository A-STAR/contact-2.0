import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IConstantsResponse } from './constants.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConstantsService } from './constants.service';

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
        .catch(() => {
          return [
            this.notificationService.createErrorAction('constants.api.errors.fetch')
          ];
        });
    });

  constructor(
    private actions: Actions,
    // private store: Store<IAppState>,
    private gridService: GridService,
    private notificationService: NotificationsService,
  ) {}

  private read(): Observable<IConstantsResponse> {
    return this.gridService.read('/constants');
  }
}
