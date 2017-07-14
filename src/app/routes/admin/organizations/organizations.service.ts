import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

import { IAppState } from '../../../core/state/state.interface';
import {
  IOrganization,
  IOrganizationsState,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IOrganizationDialogActionEnum
} from './organizations.interface';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';

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
      .distinctUntilChanged();
  }

  get organizations(): Observable<ITreeNode[]> {
    return this.store
      .select(state => state.organizations.organizations)
      .distinctUntilChanged();
  }

  get dialogAction(): Observable<IOrganizationDialogActionEnum> {
    return this.store
      .select(state => state.organizations.dialogAction)
      .distinctUntilChanged();
  }

  get selectedOrganization(): Observable<ITreeNode> {
    return this.store
      .select(state => state.organizations.selectedOrganization)
      .distinctUntilChanged();
  }

  fetchOrganizations(): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_FETCH
    });
  }

  createOrganization(organization: IOrganization): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_CREATE,
      payload: organization
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

  clearAll(): void {
    this.clearEmployees();
    this.clearOrganizations();
  }

  updateOrganizations(organizations: IOrganization[]): void {
    this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_ORDER_UPDATE,
      payload: organizations
    });
  }

  deleteOrganization(): void {
    this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_DELETE
    });
  }

  clearOrganizations(): void {
    this.store.dispatch({
      type: OrganizationsService.ORGANIZATIONS_CLEAR
    });
  }

  selectOrganization(organization: ITreeNode): void {
    return this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_SELECT,
      payload: {
        organization
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

  setDialogAction(dialogAction: IOrganizationDialogActionEnum, organization?: ITreeNode): void {
    return this.store.dispatch({
      type: OrganizationsService.DIALOG_ACTION,
      payload: {
        dialogAction,
        organization
      }
    });
  }

  getExpandedNodes(organizations: ITreeNode[]): Set<number> {
    const expandedNodes = new Set<number>();
    this.observeOrganizations(organizations, expandedNodes);
    return expandedNodes;
  }

  private observeOrganizations(nodes: ITreeNode[], expandedNodes: Set<number>): void {
    (nodes || []).forEach(node => {
      if (node.expanded) {
        expandedNodes.add(node.id);
      }
      this.observeOrganizations(node.children, expandedNodes);
    });
  }
}
