import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/combineLatest';

import { IAppState } from '../../../core/state/state.interface';
import {
  IOrganization,
  IOrganizationsState,
  IEmployee,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IOrganizationDialogActionEnum
} from './organizations.interface';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';
import { DataService } from 'app/core/data/data.service';
import { OrganizationsTreeService } from 'app/routes/admin/organizations/organizations-tree/organizations-tree.service';
import { NotificationsService } from 'app/core/notifications/notifications.service';

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
  private baseUrl = '/organizations';

  constructor(private store: Store<IAppState>,
              private dataService: DataService,
              private converterService: OrganizationsTreeService,
              private notificationsService: NotificationsService) {}

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

  fetchOrganizations(): Observable<ITreeNode[]> {
    return this.readOrganizations()
      .map(organizations =>
        this.converterService.toTreeNodes(
          organizations,
          this.getExpandedNodes(organizations)
        )
      )
      .do((organizations) =>
        this.store.dispatch({
          type: OrganizationsService.ORGANIZATION_SELECT,
          payload: {
            organization: null,
            organizations
          }
        })
      )
    .catch(
      this.notificationsService.error('errors.default.read')
        .entity('entities.organizations.gen.plural').dispatchCallback()
      );

  }

  createOrganization(organization: IOrganization): Observable<any> {
    return this.selectedOrganization
      .switchMap(selectedOrganization => {
        const parentId = selectedOrganization ? selectedOrganization.id : null;
        return this.dataService.create(this.baseUrl, {}, { ...organization, parentId });
      })
      .do(this.resetDialogAction)
      .do(this.fetchOrganizations)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.organizations.gen.singular').callback());
  }

  updateOrganization(organization: ITreeNode): Observable<any> {
    return this.selectedOrganization
      .switchMap(selectedOrganization =>
        this.dataService.update(`${this.baseUrl}/{organizationId}`, { organizationId: selectedOrganization.id }, organization))
      .do(this.resetDialogAction)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.organizations.gen.singular').callback());
  }

  readEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users`, { organizationId });
  }

  readNotAddedEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users/notadded`, { organizationId });
  }

  createEmployee(employee: IEmployeeCreateRequest): Observable<any> {
    return this.selectedOrganization
      .switchMap(selectedOrganization =>
        this.dataService.create(`${this.baseUrl}/{organizationId}/users`, { organizationId: selectedOrganization.id }, employee))
      .do(this.resetDialogAction)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.employees.gen.singular').callback());
  }

  updateEmployee(organizationId: number, userId: number, employee: IEmployeeUpdateRequest): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{organizationId}/users/{userId}`, { organizationId, userId }, employee);
  }

  deleteEmployee(organizationId: number, userId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{organizationId}/users/?id={userId}`, { organizationId, userId });
  }

  removeOrganization(): void {
    this.selectedOrganization
      .switchMap(organization => this.deleteOrganization(organization.id))
      .do(this.resetDialogAction)
      .do(this.fetchOrganizations)
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.organizations.gen.singular').callback());
  }

  clearAll(): void {
    this.clearEmployees();
    this.clearOrganizations();
  }

  updateOrganizations(organizations: IOrganization[]): void {
    Observable.forkJoin(organizations
      .map((organization: IOrganization) => this.updateOrganization(organization)))
      .do(this.resetDialogAction);
    // .mergeMap(this.resetDialogAction)
  }

  // is there any api method?
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

  setDialogAction(dialogAction: IOrganizationDialogActionEnum, data: object = {}): void {
    return this.store.dispatch({
      type: OrganizationsService.DIALOG_ACTION,
      payload: {
        dialogAction,
        data
      }
    });
  }

  resetDialogAction(): void {
    return this.store.dispatch(
      {
        type: OrganizationsService.DIALOG_ACTION,
        payload: {
          dialogAction: null
        }
      }
    );
  }

  getExpandedNodes(organizations: ITreeNode[]): Set<number> {
    const expandedNodes = new Set<number>();
    this.observeOrganizations(organizations, expandedNodes);
    return expandedNodes;
  }

  private deleteOrganization(organizationId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{organizationId}`, { organizationId });
  }

  private readOrganizations(): Observable<IOrganization[]> {
    return this.dataService.readAll(this.baseUrl);
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
