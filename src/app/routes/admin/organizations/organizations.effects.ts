import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import {
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IEmployeesResponse,
  IOrganization
} from './organizations.interface';

import { OrganizationsService } from './organizations.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class OrganizationsEffects {

  @Effect()
  fetchOrganizations$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_FETCH)
    .switchMap((action: Action) => {
      return this.readOrganizations()
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS,
          payload: {
            organizations: data.organizations
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  createOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_CREATE)
    .switchMap((action: Action) => {
      const { parentId, organization } = action.payload;
      return this.createOrganization(parentId, organization)
        .mergeMap(data => [
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
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  updateOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.updateOrganization(store.organizations.selectedOrganizationId, action.payload.organization)
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
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  updateOrganizationsOrder$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_ORDER_UPDATE)
    .switchMap(data => {
      const organizations: IOrganization[] = data.payload;
      return Observable.forkJoin(organizations
        .map((organization: IOrganization) => this.updateOrganization(organization.id, organization)))
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
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  deleteOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteOrganization(store.organizations.selectedOrganizationId)
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
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  selectOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_SELECT)
    .switchMap(action => {
      return action.payload.organizationId ?
        Observable.of({
          type: OrganizationsService.EMPLOYEES_FETCH
        }) :
        Observable.of({
          type: OrganizationsService.EMPLOYEES_CLEAR
        });
    });

  @Effect()
  fetchEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readEmployees(store.organizations.selectedOrganizationId)
        .map((response: IEmployeesResponse) => ({
          type: OrganizationsService.EMPLOYEES_FETCH_SUCCESS,
          payload: {
            employees: response.users
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  fetchNotAddedEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.readNotAddedEmployees(store.organizations.selectedOrganizationId)
        .map((response: IEmployeesResponse) => ({
          type: OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED_SUCCESS,
          payload: {
            employees: response.users
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  createEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_CREATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.createEmployee(store.organizations.selectedOrganizationId, action.payload.employee)
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
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.create');
          return null;
        });
    });

  @Effect()
  updateEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [action, store]: [Action, IAppState] = data;
      return this.updateEmployee(
        store.organizations.selectedOrganizationId,
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
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.update');
          return null;
        });
    });

  @Effect()
  deleteEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_DELETE)
    .withLatestFrom(this.store)
    .switchMap(data => {
      const [_, store]: [Action, IAppState] = data;
      return this.deleteEmployee(store.organizations.selectedOrganizationId, store.organizations.selectedEmployeeUserId)
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
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.delete');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  private readOrganizations(): Observable<any> {
    return this.gridService.read('/api/organizations');
  }

  private createOrganization(parentId: number, organization: any): Observable<any> {
    return this.gridService.create('/api/organizations', {}, { ...organization, parentId });
  }

  private updateOrganization(organizationId: number, organization: any): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}', { organizationId }, organization);
  }

  private deleteOrganization(organizationId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}', { organizationId });
  }

  private readEmployees(organizationId: number): Observable<any> {
    return this.gridService.read('/api/organizations/{organizationId}/users', { organizationId });
  }

  private readNotAddedEmployees(organizationId: number): Observable<any> {
    return this.gridService.read('/api/organizations/{organizationId}/users/notadded', { organizationId });
  }

  private createEmployee(organizationId: number, employee: IEmployeeCreateRequest): Observable<any> {
    return this.gridService.create('/api/organizations/{organizationId}/users', { organizationId }, employee);
  }

  private updateEmployee(organizationId: number, userId: number, employee: IEmployeeUpdateRequest): Observable<any> {
    return this.gridService.update('/api/organizations/{organizationId}/users/{userId}', { organizationId, userId }, employee);
  }

  private deleteEmployee(organizationId: number, userId: number): Observable<any> {
    return this.gridService.delete('/api/organizations/{organizationId}/users/?id={userId}', { organizationId, userId });
  }
}
