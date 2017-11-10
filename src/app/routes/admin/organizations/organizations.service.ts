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
  static ORGANIZATIONS_CLEAR               = 'ORGANIZATIONS_CLEAR';
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
  baseUrl = '/organizations';

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

  get employees(): Observable<IEmployee[]> {
    return this.store
      .select(state => state.organizations.employees)
      .distinctUntilChanged();
  }

  get selectedEmployee(): Observable<number> {
    return this.store
      .select(state => state.organizations.selectedEmployeeUserId)
      .distinctUntilChanged();
  }

  fetchOrganizations(): Observable<ITreeNode[]> {
    return this.readOrganizations()
      .map(this.convertToTreeNodes)
      .do(organizations =>
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

  fetchEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .switchMap(selectedOrganization => this.readEmployees(selectedOrganization.id))
      .do((employees) =>
        this.store.dispatch({
          type: OrganizationsService.EMPLOYEE_SELECT,
          payload: {
            selectedEmployeeUserId: null,
            employees
          }
        })
      )
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').dispatchCallback());
  }

  fetchNotAddedEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .switchMap(selectedOrganization => this.readNotAddedEmployees(selectedOrganization.id))
      .do(employees =>
        this.store.dispatch({
          type: OrganizationsService.EMPLOYEE_SELECT,
          payload: {
            selectedEmployeeUserId: null,
            employees
          }
        })
      )
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').dispatchCallback());
  }

  createOrganization(organization: IOrganization): Observable<any> {
    return this.selectedOrganization
      .map(selectedOrganization => {
        const parentId = selectedOrganization ? selectedOrganization.id : null;
        return this.dataService.create(this.baseUrl, {}, { ...organization, parentId });
      })
      .do(this.resetDialogAction)
      .do(this.fetchOrganizations)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.organizations.gen.singular').callback());
  }

  updateOrganization(organization: ITreeNode): Observable<any> {
    return this.selectedOrganization
      .map(selectedOrganization =>
        this.dataService.update(`${this.baseUrl}/{organizationId}`, { organizationId: selectedOrganization.id }, organization))
      .do(this.resetDialogAction)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.organizations.gen.singular').callback());
  }

  readNotAddedEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users/notadded`, { organizationId });
  }

  createEmployee(employee: IEmployeeCreateRequest): Observable<any> {
    return this.selectedOrganization
      .map(selectedOrganization =>
        this.dataService.create(`${this.baseUrl}/{organizationId}/users`, { organizationId: selectedOrganization.id }, employee))
      .do(this.fetchEmployees)
      .do(this.resetDialogAction)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.employees.gen.singular').callback());
  }

  updateEmployee(employee: IEmployeeUpdateRequest): Observable<any> {
    return Observable
      .forkJoin(this.selectedOrganization, this.selectedEmployee)
      .map((data: [IOrganization, number]) => {
        this.dataService.update(`${this.baseUrl}/{organizationId}/users/{userId}`, {
          organizationId: data[0].id, userId: data[1]
        }, employee);
      })
      .do(this.resetDialogAction)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employees.gen.singular').callback());
  }

  deleteEmployee(): Observable<any> {
    return Observable
      .forkJoin(this.selectedOrganization, this.selectedEmployee)
      .map((data: [IOrganization, number]) => {
        this.dataService.delete(`${this.baseUrl}/{organizationId}/users/?id={userId}`, {
          organizationId: data[0], userId: data[1]
        });
      })
      .do(this.resetDialogAction)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employees.gen.singular').callback());
  }

  removeOrganization(): void {
    this.selectedOrganization
      .map(organization => this.deleteOrganization(organization.id))
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

  // is there any api method for this?
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
  // is there any api method for this?
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

  private readEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users`, { organizationId });
  }

  private convertToTreeNodes(organizations: IOrganization[]): ITreeNode[] {
    return this.converterService.toTreeNodes(organizations, this.getExpandedNodes(organizations));
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
