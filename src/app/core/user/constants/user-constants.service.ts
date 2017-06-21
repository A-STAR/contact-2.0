import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IAppState } from '../../state/state.interface';
import { IUserConstant, IUserConstantAction, IUserConstantsResponse, IUserConstantsState } from './user-constants.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class UserConstantsService {
  static USER_CONSTANTS_FETCH         = 'USER_CONSTANTS_FETCH';
  static USER_CONSTANTS_FETCH_SUCCESS = 'USER_CONSTANTS_FETCH_SUCCESS';

  @Effect()
  fetchConstants$ = this.actions
    .ofType(UserConstantsService.USER_CONSTANTS_FETCH)
    .switchMap((action: IUserConstantAction) => {
      return this.read()
        .map((response: IUserConstantsResponse) => {
          return {
            type: UserConstantsService.USER_CONSTANTS_FETCH_SUCCESS,
            payload: response.data
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
    private gridService: GridService,
    private notificationService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  refresh(): void {
    this.store.dispatch({
      type: UserConstantsService.USER_CONSTANTS_FETCH
    });
  }

  get(constantName: string): Observable<IUserConstant> {
    return this.state.map(state => state.constants.find(constant => constant.name === constantName));
  }

  has(constantName: string): Observable<boolean> {
    return this.state.map(state => !!state.constants.find(constant => constant.name === constantName));
  }

  private get state(): Observable<IUserConstantsState> {
    return this.store.select('userConstants');
  }

  private read(): Observable<IUserConstantsResponse> {
    return this.gridService.read('/constants/values');
  }
}
