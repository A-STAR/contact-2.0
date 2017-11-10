import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { UnsafeAction } from '../../../core/state/state.interface';

import {
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IEmployee,
  IOrganization
} from './organizations.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { OrganizationsService } from './organizations.service';
import { OrganizationsTreeService } from './organizations-tree/organizations-tree.service';

@Injectable()
export class OrganizationsEffects {

  @Effect()
  fetchEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [UnsafeAction, IAppState] = data;
      return this.readEmployees(store.organizations.selectedOrganization.id)
        .map((employees: IEmployee[]) => ({
          type: OrganizationsService.EMPLOYEES_FETCH_SUCCESS,
          payload: { employees }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').callback());
    });

  @Effect()
  fetchEmployeesSuccess$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH_SUCCESS)
    .map(() => ({
      type: OrganizationsService.EMPLOYEE_SELECT,
      payload: {
        employeeUserId: null
      }
    }));

  @Effect()
  fetchNotAddedEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [UnsafeAction, IAppState] = data;
      return this.readNotAddedEmployees(store.organizations.selectedOrganization.id)
        .map((employees: IEmployee[]) => ({
          type: OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED_SUCCESS,
          payload: { employees }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').callback());
    });

  @Effect()
  updateEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [UnsafeAction, IAppState] = data;
      return this.updateEmployee(
        store.organizations.selectedOrganization.id,
        store.organizations.selectedEmployeeUserId,
        action.payload.employee
      )
        .mergeMap(() => [
          {
            type: OrganizationsService.EMPLOYEES_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(this.notificationsService.error('errors.default.update').entity('entities.employees.gen.singular').callback());
    });

  @Effect()
  deleteEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [UnsafeAction, IAppState] = data;
      return this.deleteEmployee(store.organizations.selectedOrganization.id, store.organizations.selectedEmployeeUserId)
        .mergeMap(() => [
          {
            type: OrganizationsService.EMPLOYEES_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(this.notificationsService.error('errors.default.delete').entity('entities.employees.gen.singular').callback());
    });

  constructor(
    private actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
    private converterService: OrganizationsTreeService,
    private organizationsService: OrganizationsService,
  ) { }
}
