import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';

import { IUserDictionary } from '../../../core/user/dictionaries/user-dictionaries.interface';
import { IActionLog, IActionsLogData, IActionsLogPayload, IEmployee } from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IAGridFilterRequest, IAGridRequestParams } from '../../../shared/components/grid2/grid2.interface';

import { DataService } from '../../../core/data/data.service';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class ActionsLogService {
  static ACTION_TYPES_FETCH_SUCCESS           = 'ACTION_TYPES_FETCH_SUCCESS';
  static ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS  = 'ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS';
  static ACTIONS_LOG_FETCH                    = 'ACTIONS_LOG_FETCH';
  static ACTIONS_LOG_FETCH_SUCCESS            = 'ACTIONS_LOG_FETCH_SUCCESS';
  static ACTIONS_LOG_DESTROY                  = 'ACTIONS_LOG_DESTROY';

  @Effect() onSearchEffect = this.actions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .switchMap((action: Action): Observable<IActionsLogPayload> => {
      const filterRequest: IAGridFilterRequest = action.payload;
      const request = this.gridService.buildRequest(filterRequest, filterRequest.filters);

      return this.dataService.create('/list?name=actions', {}, request)
        .map((payload: { data: IActionLog[], total: number }): IActionsLogPayload => {
          return {
            type: ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS,
            payload,
          };
        })
        .catch(this.notifications.error('errors.default.read').entity('entities.actionsLog.gen.plural').callback());
      }
    );

  constructor(
    private dataService: DataService,
    private actions: Actions,
    private gridService: GridService,
    private notifications: NotificationsService,
    private store: Store<IAppState>,
    private userDictionariesService: UserDictionariesService,
  ) {}

  get actionsLogRows(): Observable<IActionsLogData> {
    return this.store
      .select(state => state.actionsLog.actionsLog)
      .distinctUntilChanged();
  }

  get employeesRows(): Observable<IEmployee[]> {
    return this.store
      .select(state => state.actionsLog.employees)
      .distinctUntilChanged();
  }

  get actionTypesRows(): Observable<IUserDictionary> {
    return this.store
      .select(state => state.actionsLog.actionTypes)
      .distinctUntilChanged();
  }

  getEmployeesAndActionTypes(): Observable<void> {
    return Observable.zip(
      this.getEmployees(),
      this.getActionTypes(),
      (employees, actionTypes) => {
        this.store.dispatch({
          payload: employees,
          type: ActionsLogService.ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS,
        });
        this.store.dispatch({
          payload: actionTypes,
          type: ActionsLogService.ACTION_TYPES_FETCH_SUCCESS,
        });
      }
    );
  }

  fetch(filters: FilterObject, params: IAGridRequestParams): void {
    this.store.dispatch({
      payload: { filters, ...params },
      type: ActionsLogService.ACTIONS_LOG_FETCH,
    });
  }

  clear(): void {
    this.store.dispatch({
      payload: { data: [], total: 0 },
      type: ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS,
    });
  }

  destroy(): void {
    this.store.dispatch({ type: ActionsLogService.ACTIONS_LOG_DESTROY });
  }

  getActionTypes(): Observable<IUserDictionary> {
    return this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_ACTION_TYPES);
  }

  // TODO(a.tymchuk): use the user API
  getEmployees(): Observable<IEmployee[]> {
    return this.dataService.read('/users').map(data => data.users);
  }
}
