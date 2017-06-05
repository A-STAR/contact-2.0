import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IActionLog, IActionsLogPayload, IActionType, IEmployee } from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ActionsLogService {

  public static ACTIONS_LOG_FETCH = 'ACTIONS_LOG_FETCH';
  public static ACTIONS_LOG_SUCCESS_FETCH = 'ACTIONS_LOG_SUCCESS_FETCH';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
    private effectActions: Actions,
    private notifications: NotificationsService,
  ) {
  }

  get actionsLogRows(): Observable<IActionLog[]> {
    return this.store
      .select((state: IAppState) => state.actionsLogService.actionsLog);
  }

  @Effect() onSearchEffect = this.effectActions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .switchMap(
      (action: { payload: IActionsLogFilterRequest }): Observable<IActionsLogPayload> => {
        return this.gridService.read('/actions')
          .map((data: { actions: IActionLog[] }): IActionsLogPayload => {
            return {
              type: ActionsLogService.ACTIONS_LOG_SUCCESS_FETCH,
              payload: data.actions
            };
          });
      }
    ).catch(() => {
      this.notifications.error('Could not fetch data from the server');
      return null;
    });

  search(payload: IActionsLogFilterRequest): void {
    this.store.dispatch({
      type: ActionsLogService.ACTIONS_LOG_FETCH,
      payload
    });
  }

  getActionTypes(): Observable<IActionType[]> {
    // TODO Move dict type
    return this.gridService.read('/dictionaries/{code}/terms', { code: 4 }).map(data => data.terms);
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.gridService.read('/users').map(data => data.users);
  }
}
