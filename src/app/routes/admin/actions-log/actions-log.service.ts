import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/distinctUntilChanged';

import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';
import { IActionLog, IActionsLogData, IActionsLogPayload, IEmployee } from './actions-log.interface';
import { IAppState } from '../../../core/state/state.interface';
import { IAGridSortModel, IAGridFilterRequest } from '../../../shared/components/grid2/grid2.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';
import { FilterObject } from '../../../shared/components/grid2/filter/grid-filter';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { ValueConverterService } from '../../../core/converter/value/value-converter.service';

@Injectable()
export class ActionsLogService {
  static ACTION_TYPES_FETCH_SUCCESS           = 'ACTION_TYPES_FETCH_SUCCESS';
  static ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS  = 'ACTIONS_LOG_EMPLOYEES_FETCH_SUCCESS';
  static ACTIONS_LOG_FETCH                    = 'ACTIONS_LOG_FETCH';
  static ACTIONS_LOG_FETCH_SUCCESS            = 'ACTIONS_LOG_FETCH_SUCCESS';
  static ACTIONS_LOG_DESTROY                  = 'ACTIONS_LOG_DESTROY';

  @Effect() onSearchEffect = this.effectActions
    .ofType(ActionsLogService.ACTIONS_LOG_FETCH)
    .withLatestFrom(this.store)
    .switchMap(
      (payload): Observable<IActionsLogPayload> => {
        const [action, store]: [Action, IAppState] = payload;
        const filterRequest: IAGridFilterRequest = action.payload;
        const { currentPage, pageSize, sorters } = store.actionsLog.actionsLogGrid;
        const gridRequestPayload = { currentPage, pageSize, sorters };
        const request = this.gridService.buildRequest(gridRequestPayload, filterRequest.filters);

        return this.dataService.create('/list?name=actions', {}, request)
          .map((result: { data: IActionLog[], total: number }): IActionsLogPayload => {
            const { data, total } = result;
            return {
              payload: { data, total },
              type: ActionsLogService.ACTIONS_LOG_FETCH_SUCCESS,
            };
          })
          .catch(this.notifications.error('errors.default.read').entity('entities.actionsLog.gen.plural').callback());
      }
    );

  constructor(
    private dataService: DataService,
    private effectActions: Actions,
    private gridService: GridService,
    private notifications: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  get actionsLogCurrentPage(): Observable<number> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.currentPage)
      .distinctUntilChanged();
  }

  get actionsLogCurrentPageSize(): Observable<number> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.pageSize)
      .distinctUntilChanged();
  }

  get actionsLogSorters(): Observable<IAGridSortModel[]> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.sorters)
      .distinctUntilChanged();
  }

  get actionsLogSelected(): Observable<IDictionaryItem[]> {
    return this.store
      .select(state => state.actionsLog.actionsLogGrid.selectedRows)
      .distinctUntilChanged();
  }

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

  get actionTypesRows(): Observable<IDictionaryItem[]> {
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

  fetch(filters: FilterObject): void {
    this.store.dispatch({
      payload: { filters },
      type: ActionsLogService.ACTIONS_LOG_FETCH,
    });
  }

  filter(filters: FilterObject): void {
    this.store.dispatch({
      payload: { filters, currentPage: 1 },
      type: ActionsLogService.ACTIONS_LOG_FETCH,
    });
  }

  destroy(): void {
    this.store.dispatch({ type: ActionsLogService.ACTIONS_LOG_DESTROY });
  }
  // TODO(a.tymchuk): use the dictionary API
  getActionTypes(): Observable<IDictionaryItem[]> {
    return this.dataService.read('/dictionaries/{code}/terms', {
      code: UserDictionariesService.DICTIONARY_ACTION_TYPES
    }).map(data => data.terms);
  }

  // TODO(a.tymchuk): use the user API
  getEmployees(): Observable<IEmployee[]> {
    return this.dataService.read('/users').map(data => data.users);
  }
}
