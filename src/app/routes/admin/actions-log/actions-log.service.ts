import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';

import {
  IActionLog,
  IActionsLogData,
  IActionsLogFilterRequestPayload,
  IActionsLogPayload,
  IActionType,
  IEmployee
} from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';
import { IGrid2PaginationInfo } from '../../../shared/components/grid2/grid2.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ActionsLogService {

  public static ACTION_TYPES_FETCH_SUCCESS = 'ACTION_TYPES_FETCH_SUCCESS';
  public static ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS = 'ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS';
  public static ACTIONS_LOG_FETCH = 'ACTIONS_LOG_FETCH';
  public static ACTIONS_LOG_FETCH_SUCCESS = 'ACTIONS_LOG_FETCH_SUCCESS';

  constructor(
    private gridService: GridService,
    private store: Store<IAppState>,
    private effectActions: Actions,
    private notifications: NotificationsService,
  ) {
  }

  get actionsLogRows(): Observable<IActionsLogData> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionsLog);
  }

  get employeesRows(): Observable<IEmployee[]> {
    return this.store
      .select((state: IAppState) => state.actionsLog.employees);
  }

  get actionTypesRows(): Observable<IActionType[]> {
    return this.store
      .select((state: IAppState) => state.actionsLog.actionTypes);
  }

  getEmployeesAndActionTypes(): Observable<void> {
    return Observable.zip(
      this.getEmployees(),
      this.getActionTypes(),
      (employees, actionTypes) => {
        this.store.dispatch({
          type: ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS,
          payload: employees
        });
        this.store.dispatch({
          type: ActionsLogService.ACTION_TYPES_FETCH_SUCCESS,
          payload: actionTypes
        });
      }
    );
  }

  @Effect() onSearchEffect = this.effectActions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .switchMap(
      (action: { payload: IActionsLogFilterRequestPayload }): Observable<IActionsLogPayload> => {
        return this.gridService.create('/actions/grid', {}, {
          paging: {
            pageNumber: action.payload.pageInfo.currentPage,
            resultsPerPage: action.payload.pageInfo.pageSize
          }
        })
          .map((data: { data: IActionLog[], total: number }): IActionsLogPayload => {
            return {
              type: ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS,
              payload: {
                data: data.data,
                total: data.total
              }
            };
          });
      }
    ).catch(() => {
      this.notifications.error('actionsLog.actionsLog.messages.errors.fetch');
      return null;
    });

  search(payload: IActionsLogFilterRequest, pageInfo: IGrid2PaginationInfo): void {
    this.store.dispatch({
      type: ActionsLogService.ACTIONS_LOG_FETCH,
      payload: {
        payload: payload,
        pageInfo: pageInfo
      }
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
