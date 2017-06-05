import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IOrganization, IOrganizationsState, IEmployeeCreateRequest, IEmployeeUpdateRequest } from './organizations.interface';

@Injectable()
export class OrganizationsService {
  static ORGANIZATIONS_FETCH         = 'ORGANIZATIONS_FETCH';
  static ORGANIZATIONS_FETCH_SUCCESS = 'ORGANIZATIONS_FETCH_SUCCESS';
  static ORGANIZATIONS_CLEAR         = 'ORGANIZATIONS_CLEAR';
  static ORGANIZATION_CREATE         = 'ORGANIZATION_CREATE';
  static ORGANIZATION_UPDATE         = 'ORGANIZATION_UPDATE';
  static ORGANIZATION_DELETE         = 'ORGANIZATION_DELETE';
  static EMPLOYEES_FETCH         = 'EMPLOYEES_FETCH';
  static EMPLOYEES_FETCH_SUCCESS = 'EMPLOYEES_FETCH_SUCCESS';
  static EMPLOYEES_CLEAR         = 'EMPLOYEES_CLEAR';
  static EMPLOYEE_CREATE         = 'EMPLOYEE_CREATE';
  static EMPLOYEE_UPDATE         = 'EMPLOYEE_UPDATE';
  static EMPLOYEE_DELETE         = 'EMPLOYEE_DELETE';

  constructor(private store: Store<IAppState>) {}

  get state(): Observable<IOrganizationsState> {
    return this.store
      .select(state => state.organizations)
      .filter(Boolean);
  }

  fetchOrganizations(): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_FETCH
    });
  }

  createOrganization(parentId: number, organization: IOrganization): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_CREATE,
      payload: {
        parentId,
        organization
      }
    });
  }

  updateOrganization(organizationId: number, organization: IOrganization): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_UPDATE,
      payload: {
        organizationId,
        organization
      }
    });
  }

  deleteOrganization(organizationId: number): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_DELETE,
      payload: {
        organizationId
      }
    });
  }

  fetchEmployees(organizationId: number): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEES_FETCH,
      payload: {
        organizationId
      }
    });
  }

  createEmployee(organizationId: number, employee: IEmployeeCreateRequest): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_CREATE,
      payload: {
        organizationId,
        employee
      }
    });
  }

  updateEmployee(organizationId: number, userId: number, employee: IEmployeeUpdateRequest): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_UPDATE,
      payload: {
        organizationId,
        userId,
        employee
      }
    });
  }

  deleteEmployee(organizationId: number, userId: number): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_DELETE,
      payload: {
        organizationId,
        userId
      }
    });
  }
}
