import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import {
  IOrganization,
  IOrganizationsState,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IOrganizationDialogActionEnum
} from './organizations.interface';

@Injectable()
export class OrganizationsService {
  static ORGANIZATIONS_FETCH               = 'ORGANIZATIONS_FETCH';
  static ORGANIZATIONS_FETCH_SUCCESS       = 'ORGANIZATIONS_FETCH_SUCCESS';
  static ORGANIZATIONS_CLEAR               = 'ORGANIZATIONS_CLEAR';
  static ORGANIZATION_CREATE               = 'ORGANIZATION_CREATE';
  static ORGANIZATION_UPDATE               = 'ORGANIZATION_UPDATE';
  static ORGANIZATION_ORDER_UPDATE         = 'ORGANIZATION_ORDER_UPDATE';
  static ORGANIZATION_DELETE               = 'ORGANIZATION_DELETE';
  static ORGANIZATION_SELECT               = 'ORGANIZATION_SELECT';
  static EMPLOYEES_FETCH                   = 'EMPLOYEES_FETCH';
  static EMPLOYEES_FETCH_SUCCESS           = 'EMPLOYEES_FETCH_SUCCESS';
  static EMPLOYEES_FETCH_NOT_ADDED         = 'EMPLOYEES_FETCH_NOT_ADDED';
  static EMPLOYEES_FETCH_NOT_ADDED_SUCCESS = 'EMPLOYEES_FETCH_NOT_ADDED_SUCCESS';
  static EMPLOYEES_CLEAR                   = 'EMPLOYEES_CLEAR';
  static EMPLOYEE_CREATE                   = 'EMPLOYEE_CREATE';
  static EMPLOYEE_UPDATE                   = 'EMPLOYEE_UPDATE';
  static EMPLOYEE_DELETE                   = 'EMPLOYEE_DELETE';
  static EMPLOYEE_SELECT                   = 'EMPLOYEE_SELECT';
  static DIALOG_ACTION                     = 'DIALOG_ACTION';

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

  updateOrganization(organization: IOrganization): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_UPDATE,
      payload: {
        organization
      }
    });
  }

  updateOrganizations(organizations: IOrganization[]): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_ORDER_UPDATE,
      payload: organizations
    });
  }

  deleteOrganization(): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_DELETE
    });
  }

  clearOrganizations(): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_CLEAR
    });
  }

  selectOrganization(organizationId: number): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_SELECT,
      payload: {
        organizationId
      }
    });
  }

  fetchEmployees(): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEES_FETCH
    });
  }

  fetchNotAddedEmployees(): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEES_FETCH_NOT_ADDED
    });
  }

  createEmployee(employee: IEmployeeCreateRequest): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_CREATE,
      payload: {
        employee
      }
    });
  }

  updateEmployee(employee: IEmployeeUpdateRequest): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_UPDATE,
      payload: {
        employee
      }
    });
  }

  deleteEmployee(): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_DELETE,
    });
  }

  clearEmployees(): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEES_CLEAR,
    });
  }

  selectEmployee(employeeUserId: number): void {
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_SELECT,
      payload: {
        employeeUserId
      }
    });
  }

  setDialogAction(dialogAction: IOrganizationDialogActionEnum): void {
    return this.store.dispatch({
      type: OrganizationsService.DIALOG_ACTION,
      payload: {
        dialogAction
      }
    });
  }
}
