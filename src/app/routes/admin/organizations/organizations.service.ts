import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';

import { IAppState } from '@app/core/state/state.interface';
import {
  IOrganization,
  IOrganizationsState,
  IEmployee,
  IEmployeeCreateRequest,
  IEmployeeUpdateRequest,
  IEmployeeSelectState,
  IOrganizationSelectState,
} from './organizations.interface';
import { ITreeNode } from '@app/shared/components/flowtree/treenode/treenode.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { OrganizationsTreeService } from '@app/routes/admin/organizations/organizations-tree/organizations-tree.service';

@Injectable()
export class OrganizationsService {
  static ORGANIZATION_SELECT               = 'ORGANIZATION_SELECT';
  static EMPLOYEE_SELECT                   = 'EMPLOYEE_SELECT';

  public baseUrl = '/organizations';

  readonly state: Observable<IOrganizationsState> = this.store
    .select(state => state.organizations)
    .pipe(distinctUntilChanged());
  readonly organizations: Observable<ITreeNode[]> = this.store
    .select(state => state.organizations.organizations)
    .pipe(distinctUntilChanged());
  readonly selectedOrganization: Observable<ITreeNode> = this.store
    .select(state => state.organizations.selectedOrganization);
  readonly employees: Observable<IEmployee[]> = this.store
    .select(state => state.organizations.employees)
    .pipe(distinctUntilChanged());
  readonly selectedEmployeeId: Observable<number> = this.store
    .select(state => state.organizations.selectedEmployeeUserId);

  constructor(
    private store: Store<IAppState>,
    private dataService: DataService,
    private treeService: OrganizationsTreeService,
    private notificationsService: NotificationsService,
  ) {}

  fetchOrganizations(): Observable<ITreeNode[]> {
    return this.readOrganizations()
      .map(_organizations => this.convertToTreeNodes(_organizations))
      .map(organizations => this.selectOrganization(null, organizations))
      .map(onOrganizationSelect => onOrganizationSelect.organizations)
      .catch(this.notificationsService.fetchError().entity('entities.organizations.gen.plural').dispatchCallback());
  }

  fetchEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .pipe(first())
      .switchMap(organization => {
        return organization ? this.readEmployees(organization.id) : of([]);
      })
      // because grid component relies on row's property id
      .map(employees => employees.map<IEmployee>(employee => (employee.id = employee.userId) && employee))
      .map(employees => this.selectEmployee(null, employees))
      .map(onEmployeeSelect => onEmployeeSelect.employees)
      .catch(this.notificationsService.fetchError().entity('entities.employees.gen.plural').dispatchCallback());
  }

  fetchNotAddedEmployees(): Observable<IEmployee[]> {
    return this.selectedOrganization
      .pipe(first())
      .switchMap(organization => this.readNotAddedEmployees(organization.id))
      .map(employees => employees.map<IEmployee>(employee => {
        return {
          ...employee,
          id: employee.userId
        };
      }))
      .catch(this.notificationsService.fetchError().entity('entities.employees.gen.plural').dispatchCallback());
  }

  createOrganization(organization: IOrganization): Observable<any> {
    return this.selectedOrganization
      .pipe(first())
      .switchMap(selectedOrganization => {
        const parentId = selectedOrganization && selectedOrganization.id;
        return this.dataService.create(this.baseUrl, {}, { ...organization, parentId });
      })
      .switchMap(() => this.fetchOrganizations())
      .catch(this.notificationsService.createError().entity('entities.organizations.gen.singular').callback());
  }

  updateOrganization(organization: ITreeNode, id?: number): Observable<any> {
    return this.updateOrganizationNoFetch(organization, id)
      .switchMap(() => this.fetchOrganizations());
  }

  updateOrganizationNoFetch(organization: ITreeNode, id?: number): Observable<any> {
    return (id ? of({ id }) : this.selectedOrganization.pipe(first()))
      .switchMap(selectedOrganization =>
        this.dataService.update(`${this.baseUrl}/{organizationId}`, {
          organizationId: selectedOrganization.id
        }, organization))
      .catch(this.notificationsService.updateError().entity('entities.organizations.gen.singular').callback());
  }

  removeOrganization(): Observable<any> {
    return this.selectedOrganization
      .pipe(first())
      .switchMap(selectedOrganization =>
        this.deleteOrganization(selectedOrganization.id)
      )
      .switchMap(() => this.fetchOrganizations())
      .catch(this.notificationsService.deleteError().entity('entities.organizations.gen.singular').callback());
  }

  readNotAddedEmployees(organizationId: number): Observable<IEmployee[]> {
    return this.dataService.readAll(`${this.baseUrl}/{organizationId}/users/notadded`, { organizationId });
  }

  createEmployee(employee: IEmployeeCreateRequest): Observable<any> {
    return this.selectedOrganization
      .pipe(first())
      .switchMap(selectedOrganization => {
        return this.dataService.create(`${this.baseUrl}/{organizationId}/users`, {
        organizationId: selectedOrganization.id
      }, employee);
    }
      )
      .switchMap(() => this.fetchEmployees())
      .catch(this.notificationsService.createError().entity('entities.employees.gen.singular').callback());

  }

  updateEmployee(employee: IEmployeeUpdateRequest): Observable<any> {
    return combineLatest(
        this.selectedOrganization,
        this.selectedEmployeeId
      )
      .pipe(first())
      .switchMap(([ organization, userId ]) => {
        return this.dataService.update(`${this.baseUrl}/{organizationId}/users/{userId}`,
          { organizationId: organization.id, userId }, employee);
      })
      .switchMap(() => this.fetchEmployees())
      .catch(this.notificationsService.updateError().entity('entities.employees.gen.singular').callback());
  }

  removeEmployee(): Observable<any> {
    return combineLatest(
      this.selectedOrganization,
      this.selectedEmployeeId)
    .pipe(first())
    .switchMap(data =>
      this.dataService.delete(`${this.baseUrl}/{organizationId}/users/?id={userId}`,
        {
          organizationId: data[0].id,
          userId: data[1]
        })
    )
    .switchMap(() => this.fetchEmployees())
    .catch(this.notificationsService.updateError().entity('entities.employees.gen.singular').callback());
  }

  clearAll(): void {
    this.clearEmployees();
    this.clearOrganizations();
  }

  updateOrganizations(organizations: IOrganization[]): Observable<any> {
    return forkJoin(organizations
      .map((organization: IOrganization) => this.updateOrganizationNoFetch(organization, organization.id)));
  }

  clearOrganizations(): Observable<any[]> {
    this.selectOrganization(null, []);
    return of([]);
  }

  selectOrganization(selectedOrganization: ITreeNode, organizations?: ITreeNode[]): IOrganizationSelectState {
    const onOrganizationSelectPayload: IOrganizationSelectState = {
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

  selectEmployee(selectedEmployeeUserId: number, employees?: IEmployee[]): IEmployeeSelectState {
    const onEmployeeSelectPayload: IEmployeeSelectState = {
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
    return this.treeService.toTreeNodes(organizations, this.getExpandedNodes(organizations));
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
