import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';

import { IUserTerm } from '../../../core/user/dictionaries/user-dictionaries.interface';
import { IActionLog, IEmployee } from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IAGridRequestParams, IAGridResponse } from '../../../shared/components/grid2/grid2.interface';

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

  constructor(
    private dataService: DataService,
    private actions: Actions,
    private gridService: GridService,
    private notifications: NotificationsService,
    private store: Store<IAppState>,
    private userDictionariesService: UserDictionariesService,
  ) {}

  get employeesRows(): Observable<IEmployee[]> {
    return this.store
      .select(state => state.actionsLog.employees)
      .distinctUntilChanged();
  }

  get actionTypesRows(): Observable<IUserTerm[]> {
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

  fetch(filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IActionLog>> {
    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create('/list?name=actions', {}, request)
      .catch(this.notifications.error('errors.default.read').entity('entities.actionsLog.gen.plural').callback());
  }

  destroy(): void {
    this.store.dispatch({ type: ActionsLogService.ACTIONS_LOG_DESTROY });
  }

  getActionTypes(): Observable<IUserTerm[]> {
    return this.userDictionariesService.getDictionary(UserDictionariesService.DICTIONARY_ACTION_TYPES);
  }

  // TODO(a.tymchuk): use the user API
  getEmployees(): Observable<IEmployee[]> {
    return this.dataService.read('/users').map(data => data.users);
  }
}
