import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IActionsLogServiceState, IActionType, IEmployee } from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ActionsLogService {

  public static ACTIONS_LOG_FETCH = 'ACTIONS_LOG_FETCH';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
    private effectActions: Actions,
    private notifications: NotificationsService,
  ) {
  }

  @Effect() actionsLogService$ = this.effectActions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .switchMap(
      action => {
        return this.gridService.read('/actions').map(data => {
          return {
            type: ActionsLogService.ACTIONS_LOG_FETCH,
            success: data.actions
          };
        });
      }
    ).catch(() => {
      this.notifications.error('Could not fetch data from the server');
      return null;
    });

  get state(): Observable<IActionsLogServiceState> {
    return this.store
      .select((state) => state.actionsLogService);
  }

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

  getOperators(): Observable<IEmployee[]> {
    // TODO stub
    return new Observable<IEmployee[]>(observer => {
      setTimeout(() => {
        observer.next([
          {
            id: 100,
            lastName: 'Last name 1',
            firstName: 'First name 1',
            middleName: 'Middle name 1',
            position: 'Position 1',
            organization: 'Organization 1'
          },
          {
            id: 200,
            lastName: 'Last name 2',
            firstName: 'First name 2',
            middleName: 'Middle name 2',
            position: 'Position 2',
            organization: 'Organization 2'
          }
        ]);
        observer.complete();
      }, 1000);
    });
  }
}
