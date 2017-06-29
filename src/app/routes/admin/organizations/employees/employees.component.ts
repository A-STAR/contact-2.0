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
import { NotificationsService } from '../../../../core/notifications/notifications.service';
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
        this.organizationsService.state.map(state => !!state.selectedOrganizationId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
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
        this.organizationsService.state.map(state => !!state.selectedOrganizationId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
    { prop: 'roleCode', minWidth: 100 },
    // TODO: display column depending on filter
    // TODO: render checkbox
    { prop: 'isBlocked', minWidth: 100 },
  ];

  renderers: IRenderer = {
    fullName: (employee: IEmployeeUser) => `${employee.lastName || ''} ${employee.firstName || ''} ${employee.middleName || ''}`,
    roleCode: (column, roleCode: number) => {
      // TODO: dictionary service
      switch (roleCode) {
        case 1: return 'Сотрудник';
        case 2: return 'Руководитель';
        case 3: return 'Заместитель';
        case 4: return 'Куратор';
      }
      return roleCode;
    },
    isBlocked: ({ isBlocked }) => this.transformIsBlocked(isBlocked),
  };

  action: IOrganizationDialogActionEnum;

  editedEntity: IEmployee;

  // TODO(d.maltsev): type
  employeeRoleOptions$: Observable<Array<any>>;

  hasViewPermission$: Observable<boolean>;

  employees$: Observable<Array<IEmployee>>;

  emptyMessage$: Observable<string>;

  private organizationsStateSubscription: Subscription;

  private viewPermissionSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);

    this.organizationsStateSubscription = this.organizationsService.state
      .subscribe(
        state => {
          this.action = state.dialogAction;
          this.editedEntity = state.employees.find(employee => employee.userId === state.selectedEmployeeUserId);
        },
        // TODO: notifications
        error => console.error(error)
      );

    this.userDictionariesService.preload([ UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE ]);
    this.employeeRoleOptions$ = this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE);

    this.hasViewPermission$ = this.userPermissionsService.has('ORGANIZATION_EDIT');

    this.viewPermissionSubscription = Observable.combineLatest(
      this.hasViewPermission$,
      this.organizationsService.state.map(state => state.selectedOrganizationId).distinctUntilChanged()
    )
    .subscribe(([ hasViewPermission, currentOrganizationId ]) => {
      if (!hasViewPermission) {
        this.organizationsService.clearEmployees();
      } else if (currentOrganizationId) {
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

  onEdit(): void {
    this.userPermissionsService.has('ORGANIZATION_EDIT')
      .take(1)
      .subscribe(hasEditPermission => {
        if (hasEditPermission) {
          this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_EDIT);
        }
      });
  }

  onAddSubmit(data: any): void {
    this.organizationsService.createEmployee(data);
  }

  onEditSubmit(data: IEmployeeUser): void {
    this.organizationsService.updateEmployee({
      roleCode: data.roleCode[0].value,
      comment: data.comment
    });
  }

  onRemoveSubmit(data: any): void {
     this.organizationsService.deleteEmployee();
  }

  cancelAction(): void {
    this.organizationsService.setDialogAction(null);
  }
}
