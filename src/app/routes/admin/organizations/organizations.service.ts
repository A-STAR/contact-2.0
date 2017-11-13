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
  IOrganizationDialogActionEnum,
  IEmployeeSelectPayload,
  IOrganizationSelectPayload
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

  get selectedEmployeeId(): Observable<number> {
    return this.store
    .select(state => state.organizations.selectedEmployeeUserId)
    .distinctUntilChanged();
  }

  fetchOrganizations(): Observable<ITreeNode[]> {
    return this.readOrganizations()
      .map(_organizations => this.convertToTreeNodes(_organizations))
      .do(organizations =>
        this.selectOrganization(null, organizations)
      )
      .catch(
        this.notificationsService.error('errors.default.read')
          .entity('entities.organizations.gen.plural').dispatchCallback()
      );
  }

  fetchEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .take(1)
      .switchMap(organization => organization ? this.readEmployees(organization.id) : Observable.of([]))
      // because grid component relies on row's property id
      .map(employees => employees.map(employee => (employee.id = employee.userId) && employee))
      .do(employees => this.selectEmployee(null, employees))
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').dispatchCallback());
  }

  fetchNotAddedEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .take(1)
      .switchMap(organization => this.readNotAddedEmployees(organization.id))
      .do(employees => this.selectEmployee(null, employees))
      .catch(this.notificationsService.error('errors.default.read').entity('entities.employees.gen.plural').dispatchCallback());
  }

  createOrganization(organization: IOrganization): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .switchMap(selectedOrganization =>
        this.dataService.create(this.baseUrl, {}, { ...organization, parentId: selectedOrganization.id })
      )
      .do(() => this.resetDialogAction())
      .do(() => this.fetchOrganizations())
      .catch(this.notificationsService.error('errors.default.create').entity('entities.organizations.gen.singular').callback());
  }

  updateOrganization(organization: ITreeNode): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .switchMap(selectedOrganization =>
        this.dataService.update(`${this.baseUrl}/{organizationId}`, {
          organizationId: selectedOrganization.id
        }, organization))
      .do(() => this.resetDialogAction())
      .catch(this.notificationsService.error('errors.default.update').entity('entities.organizations.gen.singular').callback());
  }

  removeOrganization(): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .switchMap(selectedOrganization =>
        this.deleteOrganization(selectedOrganization.id)
      )
      .do(() => this.resetDialogAction())
      .do(() => this.fetchOrganizations())
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.organizations.gen.singular').callback());
  }

  readNotAddedEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users/notadded`, { organizationId });
  }

  createEmployee(employee: IEmployeeCreateRequest): Observable<any> {
    return this.selectedOrganization
      .take(1)
      .map(selectedOrganization => this.dataService.create(`${this.baseUrl}/{organizationId}/users`, {
        organizationId: selectedOrganization.id
      }, employee)
      )
      .do(() => this.fetchEmployees())
      .do(() => this.resetDialogAction())
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
      .do(() => this.resetDialogAction())
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
      .do(() => this.resetDialogAction())
      .catch(this.notificationsService.error('errors.default.update').entity('entities.employees.gen.singular').callback());
  }

  clearAll(): void {
    this.clearEmployees();
    this.clearOrganizations();
  }

  updateOrganizations(organizations: IOrganization[]): Observable<any> {
    return Observable.forkJoin(organizations
      .map((organization: IOrganization) => this.updateOrganization(organization)))
      .do(() => this.resetDialogAction());
  }

  clearOrganizations(): Observable<any[]> {
    this.selectOrganization(null, []);
    return Observable.of([]);
  }

  selectOrganization(selectedOrganization: ITreeNode, organizations?: ITreeNode[]): void {
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
  }

  clearEmployees(): void {
    this.selectEmployee(null, []);
  }

  selectEmployee(selectedEmployeeUserId: number, employees?: IEmployee[]): void {
    const onEmployeeSelectPayload: IEmployeeSelectPayload = {
      selectedEmployeeUserId
    };
    if (employees) {
      onEmployeeSelectPayload.employees = employees;
    }
    return this.store.dispatch({
      type: OrganizationsService.EMPLOYEE_SELECT,
      payload: onEmployeeSelectPayload
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
