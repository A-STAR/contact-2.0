import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import {
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IEmployeesResponse,
  IOrganization
} from './organizations.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { OrganizationsService } from './organizations.service';
import { OrganizationsTreeService } from './organizations-tree/organizations-tree.service';

@Injectable()
export class OrganizationsEffects {

  @Effect()
  fetchOrganizations$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readOrganizations()
        .map(response => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS,
          payload: {
            organizations: this.converterService.toTreeNodes(
              response.organizations,
              this.organizationsService.getExpandedNodes(store.organizations.organizations)
            )
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.organizations.gen.plural').callback());
    });

  @Effect()
  fetchOrganizationsSuccess$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS)
    .map(() => ({
      type: OrganizationsService.ORGANIZATION_SELECT,
      payload: {
        organizationId: null
      }
    }));

  @Effect()
  createOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_CREATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      const parentId = store.organizations.selectedOrganization ? store.organizations.selectedOrganization.id : null;
      return this.createOrganization(parentId, action.payload)
        .mergeMap(result => [
          {
            type: OrganizationsService.ORGANIZATIONS_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null,
              selectedOrganization: null
            }
          }
        ])
        .catch(this.notificationsService.error('errors.default.create').entity('entities.organizations.gen.singular').callback());
    });

  @Effect()
  updateOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.updateOrganization(store.organizations.selectedOrganization.id, action.payload.organization)
        .mergeMap(() => [
          {
            type: OrganizationsService.ORGANIZATIONS_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(this.notificationsService.error('errors.default.update').entity('entities.organizations.gen.singular').callback());
    });

  @Effect()
  updateOrganizationsOrder$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_ORDER_UPDATE)
    .switchMap(data => {
      const organizations: IOrganization[] = data.payload;
      return Observable.forkJoin(organizations
        .map((organization: IOrganization) => this.updateOrganization(organization.id, organization)))
        .mergeMap(() => [
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(this.notificationsService.error('errors.default.update').entity('entities.organizations.gen.singular').callback());
    });

  @Effect()
  deleteOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteOrganization(store.organizations.selectedOrganization.id)
        .mergeMap(() => [
          {
            type: OrganizationsService.ORGANIZATIONS_FETCH
          },
          {
            type: OrganizationsService.ORGANIZATION_SELECT,
            payload: {
              organizationId: null
            }
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ])
        .catch(this.notificationsService.error('errors.default.delete').entity('entities.organizations.gen.singular').callback());
    });

  @Effect()
  fetchEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readEmployees(store.organizations.selectedOrganization.id)
        .map((response: IEmployeesResponse) => ({
          type: OrganizationsService.EMPLOYEES_FETCH_SUCCESS,
          payload: {
            employees: response.users
          }
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
      const [_, store]: [Action, IAppState] = data;
      return this.readNotAddedEmployees(store.organizations.selectedOrganization.id)
        .map((response: IEmployeesResponse) => ({
          type: OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED_SUCCESS,
          payload: {
            employees: response.users
          }
        }))
        .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').callback());
    });

  @Effect()
  createEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_CREATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.createEmployee(store.organizations.selectedOrganization.id, action.payload.employee)
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
        .catch(this.notificationsService.error('errors.default.create').entity('entities.employees.gen.singular').callback());
    });

  @Effect()
  updateEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
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
      const [_, store]: [Action, IAppState] = data;
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
  ) {}

  private readOrganizations(): Observable<any> {
    return this.dataService.read('/organizations');
  }

  private createOrganization(parentId: number, organization: any): Observable<any> {
    return this.dataService.create('/organizations', {}, { ...organization, parentId });
  }

  private updateOrganization(organizationId: number, organization: any): Observable<any> {
    return this.dataService.update('/organizations/{organizationId}', { organizationId }, organization);
  }

  private deleteOrganization(organizationId: number): Observable<any> {
    return this.dataService.delete('/organizations/{organizationId}', { organizationId });
  }

  private readEmployees(organizationId: number): Observable<any> {
    return this.dataService.read('/organizations/{organizationId}/users', { organizationId });
  }

  private readNotAddedEmployees(organizationId: number): Observable<any> {
    return this.dataService.read('/organizations/{organizationId}/users/notadded', { organizationId });
  }

  private createEmployee(organizationId: number, employee: IEmployeeCreateRequest): Observable<any> {
    return this.dataService.create('/organizations/{organizationId}/users', { organizationId }, employee);
  }

  private updateEmployee(organizationId: number, userId: number, employee: IEmployeeUpdateRequest): Observable<any> {
    return this.dataService.update('/organizations/{organizationId}/users/{userId}', { organizationId, userId }, employee);
  }

  private deleteEmployee(organizationId: number, userId: number): Observable<any> {
    return this.dataService.delete('/organizations/{organizationId}/users/?id={userId}', { organizationId, userId });
  }
}
