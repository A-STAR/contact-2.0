import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { IEmployeeCreateRequest, IEmployeeUpdateRequest } from './organizations.interface';

import { OrganizationsService } from './organizations.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class OrganizationsEffects {

  @Effect()
  fetchEmployees$ = this.actions
    .ofType(OrganizationsService.EMPLOYEES_FETCH)
    .switchMap(action => {
      const { organizationId } = action.payload;
      return this.readEmployees(organizationId)
        .map(data => ({
          type: OrganizationsService.EMPLOYEES_FETCH_SUCCESS,
          payload: data
        }))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  createEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_CREATE)
    .switchMap(action => {
      const { organizationId, employee } = action.payload;
      return this.createEmployee(organizationId, employee)
        .map(data => ({
          type: OrganizationsService.EMPLOYEES_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.create');
          return null;
        });
    });

  @Effect()
  updateEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_UPDATE)
    .switchMap(action => {
      const { organizationId, userId, employee } = action.payload;
      return this.updateEmployee(organizationId, userId, employee)
        .map(data => ({
          type: OrganizationsService.EMPLOYEES_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.update');
          return null;
        });
    });

  @Effect()
  deleteEmployee$ = this.actions
    .ofType(OrganizationsService.EMPLOYEE_DELETE)
    .switchMap(action => {
      const { organizationId, userId } = action.payload;
      return this.deleteEmployee(organizationId, userId)
        .map(data => ({
          type: OrganizationsService.EMPLOYEES_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.employees.messages.errors.delete');
          return null;
        });
    });

  @Effect()
  fetch$ = this.actions
    .ofType(OrganizationsService.ORGANIZATIONS_FETCH)
    .switchMap(action => {
      return this.readOrganizations()
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH_SUCCESS,
          payload: data
        }))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  create$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_CREATE)
    .switchMap(action => {
      const { parentId, organization } = action.payload;
      return this.createOrganization(parentId, organization)
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH
        }))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  update$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_UPDATE)
    .switchMap(action => {
      const { organizationId, organization } = action.payload;
      return this.updateOrganization(organizationId, organization)
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  @Effect()
  delete$ = this.actions
    .ofType(OrganizationsService.ORGANIZATION_DELETE)
    .switchMap(action => {
      const { organizationId } = action.payload;
      return this.deleteOrganization(organizationId)
        .map(data => ({
          type: OrganizationsService.ORGANIZATIONS_FETCH,
          payload: {
            organizationId
          }
        }))
        .catch(() => {
          this.notificationsService.error('organizations.organizations.messages.errors.fetch');
          return null;
        });
    });

  constructor(
    private actions: Actions,
    private gridService: GridService,
    private notificationsService: NotificationsService,
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
