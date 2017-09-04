import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IEmployeeUser, IEmployee, IOrganizationDialogActionEnum, IOrganizationsState } from '../organizations.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { OrganizationsService } from '../organizations.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent implements OnDestroy {
  @Input() employees: Array<IEmployee>;
  @ViewChild(GridComponent) grid: GridComponent;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_ADD),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.selectedOrganization
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_EDIT),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.state.map(state => !!state.selectedEmployeeUserId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_REMOVE),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.state.map(state => !!state.selectedEmployeeUserId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.organizationsService.fetchEmployees(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_VIEW'),
        this.organizationsService.selectedOrganization
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
    { prop: 'roleCode', minWidth: 100 },
    { prop: 'isBlocked', minWidth: 100 },
  ];

  renderers: IRenderer = {
    isBlocked: 'checkboxRenderer',
  };

  action: IOrganizationDialogActionEnum;

  editedEntity: IEmployee;

  // TODO(d.maltsev): type
  employeeRoleOptions$: Observable<Array<any>>;

  employees$: Observable<Array<IEmployee>>;

  emptyMessage$: Observable<string>;

  private hasViewPermission$: Observable<boolean>;

  private organizationsStateSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE)
      .take(1)
      .subscribe(employeeRoles => {
        this.renderers.roleCode = employeeRoles;
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      });

    this.organizationsStateSubscription = this.organizationsService.state
      .subscribe(state => {
        this.action = state.dialogAction;
        this.editedEntity = state.employees.find(employee => employee.userId === state.selectedEmployeeUserId);
      });

    this.employeeRoleOptions$ = this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE);

    this.hasViewPermission$ = this.userPermissionsService.has('ORGANIZATION_VIEW');

    this.viewPermissionSubscription = Observable.combineLatest(
      this.hasViewPermission$,
      this.organizationsService.selectedOrganization
    )
    .subscribe(([ hasViewPermission, currentOrganization ]) => {
      if (!hasViewPermission) {
        this.organizationsService.clearEmployees();
      } else if (currentOrganization) {
        this.organizationsService.fetchEmployees();
      }
    });

    this.employees$ = this.organizationsService.state.map(state => state.employees);
    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'organizations.employees.errors.view');
  }

  ngOnDestroy(): void {
    this.organizationsStateSubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  get state(): Observable<IOrganizationsState> {
    return this.organizationsService.state;
  }

  get isEntityBeingCreated(): boolean {
    return this.action === IOrganizationDialogActionEnum.EMPLOYEE_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === IOrganizationDialogActionEnum.EMPLOYEE_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.action === IOrganizationDialogActionEnum.EMPLOYEE_REMOVE;
  }

  transformIsBlocked(isBlocked: number): string {
    return this.translateService.instant(isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No');
  }

  onSelect(employee: IEmployee): void {
    if (employee) {
      this.organizationsService.selectEmployee(employee.userId);
    }
  }

  onEdit(employee: IEmployee): void {
    this.userPermissionsService.has('ORGANIZATION_EDIT')
      .take(1)
      .subscribe(hasEditPermission => {
        if (hasEditPermission) {
          const selectedEmployeeUserId = employee.userId;
          this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_EDIT, { selectedEmployeeUserId });
        }
      });
  }

  onAddSubmit(data: any): void {
    this.organizationsService.createEmployee(data);
  }

  onEditSubmit(data: IEmployeeUser): void {
    this.organizationsService.updateEmployee({
      roleCode: data.roleCode[0].value,
      comment: data.comment,
      isMain: Number(data.isMain),
    });
  }

  onRemoveSubmit(data: any): void {
     this.organizationsService.deleteEmployee();
  }

  cancelAction(): void {
    this.organizationsService.setDialogAction(null);
  }
}
