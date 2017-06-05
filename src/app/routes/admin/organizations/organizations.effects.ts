import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { IAppState } from '../../../core/state/state.interface';
import { IEmployeeCreateRequest, IEmployeeUpdateRequest } from './organizations.interface';

import { OrganizationsService } from './organizations.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class OrganizationsEffects {

  @Effect()
  fetchOrganizations$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_FETCH)
    .switchMap(action => {
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
    .switchMap(action => {
      const { parentId, organization } = action.payload;
      return this.createOrganization(parentId, organization)
        .mergeMap(data => Observable.from([
          {
            type: OrganizationsService.ORGANIZATIONS_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  updateOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return this.updateOrganization(store.organizations.organizations.selectedId, action.payload.organization)
        .mergeMap(data => Observable.from([
          {
            type: OrganizationsService.ORGANIZATIONS_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  deleteOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_DELETE)
    .withLatestFrom(this.store)
    .switchMap(([_, store]) => {
      return this.deleteOrganization(store.organizations.organizations.selectedId)
        .mergeMap(data => Observable.from([
          {
            type: OrganizationsService.ORGANIZATIONS_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  selectOrganization$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_SELECT)
    .map(() => ({
      type: OrganizationsService.EMPLOYEES_FETCH
    }));

  @Effect()
  fetchEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH)
    .withLatestFrom(this.store)
    .switchMap(([_, store]) => {
      return this.readEmployees(store.organizations.organizations.selectedId)
        .map(data => ({
          type: OrganizationsService.EMPLOYEES_FETCH_SUCCESS,
          payload: {
            employees: data.users
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
    .switchMap(([_, store]) => {
      return this.readNotAddedEmployees(store.organizations.organizations.selectedId)
        .map(data => ({
          type: OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED_SUCCESS,
          payload: {
            employees: data.users
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
    .switchMap(([action, store]) => {
      return this.createEmployee(store.organizations.organizations.selectedId, action.payload.employee)
        .mergeMap(data => Observable.from([
          {
            type: OrganizationsService.EMPLOYEES_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.create');
          return null;
        });
    });

  @Effect()
  updateEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_UPDATE)
    .withLatestFrom(this.store)
    .switchMap(([action, store]) => {
      return this.updateEmployee(
        store.organizations.organizations.selectedId,
        store.organizations.employees.selectedUserId,
        action.payload.employee
      )
        .mergeMap(data => Observable.from([
          {
            type: OrganizationsService.EMPLOYEES_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.update');
          return null;
        });
    });

  @Effect()
  deleteEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_DELETE)
    .withLatestFrom(this.store)
    .switchMap(([_, store]) => {
      return this.deleteEmployee(store.organizations.organizations.selectedId, store.organizations.employees.selectedUserId)
        .mergeMap(data => Observable.from([
          {
            type: OrganizationsService.EMPLOYEES_FETCH
          },
          {
            type: OrganizationsService.DIALOG_ACTION,
            payload: {
              dialogAction: null
            }
          }
        ]))
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
