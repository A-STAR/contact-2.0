import { Component, Input, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import {
  IEmployee,
  IEmployeeViewEntity,
  OrganizationDialogActionEnum,
  IOrganizationsState,
  IEmployeeUpdateRequest} from '../organizations.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { OrganizationsService } from '../organizations.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { DialogFunctions } from 'app/core/dialog';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input() employees: Array<IEmployee>;
  @ViewChild(GridComponent) grid: GridComponent;
  dialog: string;
  private currentDialogAction: OrganizationDialogActionEnum = OrganizationDialogActionEnum.NONE;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.currentDialogAction = OrganizationDialogActionEnum.EMPLOYEE_ADD,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        Observable.of(this.organizationsService.selectedOrganization)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.currentDialogAction = OrganizationDialogActionEnum.EMPLOYEE_EDIT,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.state.map(state => !!state.selectedEmployeeUserId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.currentDialogAction = OrganizationDialogActionEnum.EMPLOYEE_REMOVE,
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_EDIT'),
        this.organizationsService.state.map(state => !!state.selectedEmployeeUserId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetchEmployees(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.has('ORGANIZATION_VIEW'),
        this.organizationsService.selectedOrganization
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
    { prop: 'roleCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE },
    { prop: 'isInactive', minWidth: 100, renderer: 'checkboxRenderer' },
  ];

  editedEntity: IEmployeeViewEntity;

  // TODO(d.maltsev): type
  employeeRoleOptions$: Observable<Array<any>>;

  employees$: Observable<Array<IEmployeeViewEntity>>;

  emptyMessage$: Observable<string>;

  private hasViewPermission$: Observable<boolean>;

  private selectedEmployeeSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.selectedEmployeeSubscription = Observable.combineLatest(
      this.organizationsService.selectedEmployeeId,
      this.organizationsService.employees
    ).subscribe((data: [number, IEmployeeViewEntity[]]) => {
      this.editedEntity = data[1].find(employee => employee.userId === data[0]);
    });

    this.employeeRoleOptions$ = this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE);

    this.hasViewPermission$ = this.userPermissionsService.has('ORGANIZATION_VIEW');

    this.viewPermissionSubscription = Observable.combineLatest(
      this.hasViewPermission$
    )
      .subscribe(([hasViewPermission, currentOrganization]) => {
        if (!hasViewPermission) {
          this.organizationsService.clearEmployees();
        }
      });

    this.employees$ = this.organizationsService.employees;

    this.emptyMessage$ = this.hasViewPermission$
      .map(hasPermission => hasPermission ? null : 'organizations.employees.errors.view');
  }

  ngOnDestroy(): void {
    this.selectedEmployeeSubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  get state(): Observable<IOrganizationsState> {
    return this.organizationsService.state;
  }

  get isEntityBeingCreated(): boolean {
    return this.currentDialogAction === OrganizationDialogActionEnum.EMPLOYEE_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.currentDialogAction === OrganizationDialogActionEnum.EMPLOYEE_EDIT;
  }

  get isEntityBeingRemoved(): boolean {
    return this.currentDialogAction === OrganizationDialogActionEnum.EMPLOYEE_REMOVE;
  }

  transformIsInactive(isInactive: number): string {
    return this.translateService.instant(isInactive ? 'default.yesNo.Yes' : 'default.yesNo.No');
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
          this.currentDialogAction = OrganizationDialogActionEnum.EMPLOYEE_EDIT;
          this.organizationsService.selectEmployee(selectedEmployeeUserId);
        }
      });
  }

  onAddSubmit(data: any): void {
    this.organizationsService.createEmployee(data).subscribe(() => this.cancelAction());
  }

  onEditSubmit(data: IEmployeeUpdateRequest): void {
    this.organizationsService.updateEmployee(data).subscribe(() => this.cancelAction());
  }

  onRemoveSubmit(data: any): void {
     this.organizationsService.removeEmployee().subscribe(() => this.cancelAction());
  }

  cancelAction(): void {
    this.currentDialogAction = OrganizationDialogActionEnum.NONE;
    this.onCloseDialog();
  }

  fetchEmployees(): void {
    this.organizationsService.fetchEmployees().subscribe(() => this.cancelAction());
  }
}
