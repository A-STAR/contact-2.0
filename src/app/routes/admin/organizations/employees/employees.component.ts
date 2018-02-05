import { ChangeDetectionStrategy, Component, Input, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import {
  IEmployee, IOrganizationsState, IEmployeeUpdateRequest, IEmployeeCreateRequest
} from '../organizations.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { OrganizationsService } from '../organizations.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { DialogFunctions } from '../../../../core/dialog';
import { combineLatestAnd } from '../../../../core/utils/helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employees',
  templateUrl: './employees.component.html',
})
export class EmployeesComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridComponent) grid: GridComponent;

  @Input() employees: Array<IEmployee>;

  dialog: string;

  titlebar: ITitlebar = {
    title: 'organizations.employees.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_ADD,
        action: () => this.setDialog('create'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ORGANIZATION_EDIT'),
          this.organizationsService.selectedOrganization.map(o => !!o)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_EDIT,
        action: () => this.setDialog('edit'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ORGANIZATION_EDIT'),
          this.organizationsService.state.map(state => !!state.selectedEmployeeUserId)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.userPermissionsService.has('ORGANIZATION_DELETE'),
          this.organizationsService.state.map(state => !!state.selectedEmployeeUserId)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetchEmployees(),
        enabled: combineLatest(
          this.userPermissionsService.has('ORGANIZATION_VIEW'),
          this.organizationsService.selectedOrganization
        ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && !!hasSelectedEntity)
      },
    ]
  };

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
    { prop: 'roleCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE },
    { prop: 'isInactive', minWidth: 100, renderer: 'checkboxRenderer' },
  ];

  editedEntity: IEmployee;

  // TODO(d.maltsev): type
  employeeRoleOptions$: Observable<Array<any>>;

  employees$: Observable<IEmployee[]>;

  emptyMessage$: Observable<string>;

  private hasViewPermission$: Observable<boolean>;

  private selectedEmployeeSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private gridService: GridService,
    private organizationsService: OrganizationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.selectedEmployeeSubscription = combineLatest(
      this.organizationsService.selectedEmployeeId,
      this.organizationsService.employees
    ).subscribe((data: [number, IEmployee[]]) => {
      this.editedEntity = data[1].find(employee => employee.userId === data[0]);
    });

    this.employeeRoleOptions$ = this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE);

    this.hasViewPermission$ = this.userPermissionsService.has('ORGANIZATION_VIEW');

    this.viewPermissionSubscription = combineLatest(
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

  onSelect(employee: IEmployee): void {
    if (employee) {
      this.organizationsService.selectEmployee(employee.userId);
    }
  }

  onEdit(employee: IEmployee): void {
    this.userPermissionsService.has('ORGANIZATION_EDIT')
      .pipe(first())
      .subscribe(hasEditPermission => {
        if (hasEditPermission) {
          const selectedEmployeeUserId = employee.userId;
          this.organizationsService.selectEmployee(selectedEmployeeUserId);
          this.setDialog('edit');
        }
      });
  }

  onAddSubmit(data: IEmployeeCreateRequest): void {
    this.organizationsService.createEmployee(data).subscribe(() => this.cancelAction());
  }

  onEditSubmit(data: IEmployeeUpdateRequest): void {
    this.organizationsService.updateEmployee(data).subscribe(() => this.cancelAction());
  }

  onRemoveSubmit(data: any): void {
     this.organizationsService.removeEmployee().subscribe(() => this.cancelAction());
  }

  cancelAction(): void {
    this.onCloseDialog();
  }

  fetchEmployees(): void {
    this.organizationsService.fetchEmployees().subscribe(() => this.cancelAction());
  }
}
