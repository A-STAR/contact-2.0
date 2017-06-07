import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IConstant } from './constants.interface';
import { IAppState } from '../state/state.interface';

import { GridService } from '../../shared/components/grid/grid.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConstantsService } from './constants.service';

@Injectable()
export class ConstantsEffects {

  @Effect() fetchConstants = this.actions
    .ofType(ConstantsService.CONSTANT_FETCH)
    .switchMap((action: Action) => {
      return this.read()
        .map(constants => ({
          type: ConstantsService.CONSTANT_FETCH_SUCCESS,
          payload: constants
        }))
        .catch(() => {
          this.notifications.error('Could not fetch constants');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private store: Store<IAppState>,
    private gridService: GridService,
    private notifications: NotificationsService,
  ) {}

  private read(): Observable<IConstant[]> {
    return this.gridService.read('/constants');
  }
}
