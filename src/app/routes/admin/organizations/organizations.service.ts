import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/never';

import { IAppState } from '../../../core/state/state.interface';
import {
  IOrganization,
  IOrganizationsState,
  IEmployee,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  OrganizationDialogActionEnum,
  IEmployeeSelectPayload,
  IOrganizationSelectPayload,
  IEmployeeViewEntity
} from './organizations.interface';

import { ITreeNode } from '../../../shared/components/flowtree/treenode/treenode.interface';
import { DataService } from 'app/core/data/data.service';
import { OrganizationsTreeService } from 'app/routes/admin/organizations/organizations-tree/organizations-tree.service';
import { NotificationsService } from 'app/core/notifications/notifications.service';
import { ISelectItemsPayload } from 'app/shared/components/form/dynamic-form/dynamic-form.interface';

@Injectable()
export class OrganizationsService {
  static ORGANIZATION_SELECT               = 'ORGANIZATION_SELECT';
  static EMPLOYEE_SELECT                   = 'EMPLOYEE_SELECT';
  static DIALOG_ACTION                     = 'DIALOG_ACTION';
  public baseUrl = '/organizations';

  constructor(private store: Store<IAppState>,
    private dataService: DataService,
    private converterService: OrganizationsTreeService,
    private notificationsService: NotificationsService) {
  }

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

  get selectedOrganization(): Observable<ITreeNode> {
    return this.store
    .select(state => state.organizations.selectedOrganization);
  }

  get employees(): Observable<IEmployeeViewEntity[]> {
    return this.store
      .select(state => state.organizations.employees)
      .distinctUntilChanged();
  }

  get selectedEmployeeId(): Observable<number> {
    return this.store
    .select(state => state.organizations.selectedEmployeeUserId);
  }

  fetchOrganizations(): Observable<ITreeNode[]> {
    return this.readOrganizations()
      .map(_organizations => this.convertToTreeNodes(_organizations))
      .map(organizations => this.selectOrganization(null, organizations))
      .map(onOrganizationSelect => onOrganizationSelect.organizations)
      .catch(
        this.notificationsService.error('errors.default.read')
          .entity('entities.organizations.gen.plural').dispatchCallback()
      );
  }

  fetchEmployees(): Observable<IEmployeeViewEntity[]> {
    return this.selectedOrganization
      .take(1)
      .switchMap(organization => organization ? this.readEmployees(organization.id) : Observable.of([]))
      // because grid component relies on row's property id
      .map(employees => employees.map<IEmployeeViewEntity>(employee => (employee.id = employee.userId) && employee))
      .map(employees => this.selectEmployee(null, employees))
      .map(onEmployeeSelect => onEmployeeSelect.employees)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').dispatchCallback());
  }

  fetchNotAddedEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .take(1)
      .switchMap(organization => this.readNotAddedEmployees(organization.id))
      .map(employees => employees.map<IEmployeeViewEntity>(employee => {
        return {
          ...employee,
          id: employee.userId
        };
      }))
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').dispatchCallback());
  }

  createOrganization(organization: IOrganization): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .switchMap(selectedOrganization => {
        const parentId = selectedOrganization && selectedOrganization.id;
        return this.dataService.create(this.baseUrl, {}, { ...organization, parentId });
      })
      .switchMap(() => this.fetchOrganizations())
      .catch(this.notificationsService.error('errors.default.create').entity('entities.organizations.gen.singular').callback());
  }

  updateOrganization(organization: ITreeNode, id?: number): Observable<any> {
    return this.updateOrganizationNoFetch(organization, id)
      .switchMap(() => this.fetchOrganizations());
  }

  updateOrganizationNoFetch(organization: ITreeNode, id?: number): Observable<any> {
    return (id ? Observable.of({ id }) : this.selectedOrganization
      .take(1))
      .switchMap(selectedOrganization =>
        this.dataService.update(`${this.baseUrl}/{organizationId}`, {
          organizationId: selectedOrganization.id
        }, organization))
      .catch(this.notificationsService.error('errors.default.update').entity('entities.organizations.gen.singular').callback());
  }

  removeOrganization(): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .switchMap(selectedOrganization =>
        this.deleteOrganization(selectedOrganization.id)
      )
      .switchMap(() => this.fetchOrganizations())
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.organizations.gen.singular').callback());
  }

  readNotAddedEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users/notadded`, { organizationId });
  }

  createEmployee(employee: IEmployeeCreateRequest): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .switchMap(selectedOrganization => {
        return this.dataService.create(`${this.baseUrl}/{organizationId}/users`, {
        organizationId: selectedOrganization.id
      }, employee);
    }
      )
      .switchMap(() => this.fetchEmployees())
      .catch(this.notificationsService.error('errors.default.create').entity('entities.employees.gen.singular').callback());

  }

  updateEmployee(employee: IEmployeeUpdateRequest): Observable<any> {
    return Observable.combineLatest(
      this.selectedOrganization,
      this.selectedEmployeeId)
      .take(1)
      .switchMap(data => this.dataService.update(`${this.baseUrl}/{organizationId}/users/{userId}`, {
        organizationId: data[0].id,
        userId: data[1]
      }, employee))
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employees.gen.singular').callback());
  }

  deleteEmployee(): Observable<any> {
    return Observable.combineLatest(
      this.selectedOrganization,
      this.selectedEmployeeId)
      .take(1)
      .switchMap(data =>
        this.dataService.delete(`${this.baseUrl}/{organizationId}/users/?id={userId}`,
          {
            organizationId: data[0].id,
            userId: data[1]
          })
        )
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employees.gen.singular').callback());
  }

  clearAll(): void {
    this.clearEmployees();
    this.clearOrganizations();
  }

  updateOrganizations(organizations: IOrganization[]): Observable<any> {
    return Observable.forkJoin(organizations
      .map((organization: IOrganization, index: number) =>
        this.updateOrganizationNoFetch(organization, organization.id)));
  }

  clearOrganizations(): Observable<any[]> {
    this.selectOrganization(null, []);
    return Observable.of([]);
  }

  selectOrganization(selectedOrganization: ITreeNode, organizations?: ITreeNode[]): IOrganizationSelectPayload {
    const onOrganizationSelectPayload: IOrganizationSelectPayload = {
      selectedOrganization
    };
    if (organizations) {
      onOrganizationSelectPayload.organizations = organizations;
    }
    this.store.dispatch({
      type: OrganizationsService.ORGANIZATION_SELECT,
      payload: onOrganizationSelectPayload
    });
    return onOrganizationSelectPayload;
  }

  clearEmployees(): void {
    this.selectEmployee(null, []);
  }

  selectEmployee(selectedEmployeeUserId: number, employees?: IEmployeeViewEntity[]): IEmployeeSelectPayload {
    const onEmployeeSelectPayload: IEmployeeSelectPayload = {
      selectedEmployeeUserId
    };
    if (employees) {
      onEmployeeSelectPayload.employees = employees;
    }
    this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_SELECT,
      payload: onEmployeeSelectPayload
    });
    return onEmployeeSelectPayload;
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
