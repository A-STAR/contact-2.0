import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import {
  IEmployee,
  IOrganizationsState,
  IEmployeeUpdateRequest,
  IEmployeeCreateRequest,
} from '../organizations.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { OrganizationsService } from '../organizations.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd } from '@app/core/utils/helpers';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-employees',
  templateUrl: './employees.component.html',
})
export class EmployeesComponent extends DialogFunctions implements OnInit, OnDestroy {
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

  columns: ISimpleGridColumn<IEmployee>[] = [
    { prop: 'fullName', minWidth: 150 },
    { prop: 'position', minWidth: 100 },
    { prop: 'roleCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE },
    { prop: 'isInactive', minWidth: 100, renderer: 'checkboxRenderer' },
  ].map(addGridLabel('organizations.employees.grid'));

  editedEntity: IEmployee;

  // TODO(d.maltsev): type
  employeeRoleOptions$: Observable<Array<any>>;

  employees$: Observable<IEmployee[]>;

  emptyMessage$: Observable<string>;

  private hasViewPermission$: Observable<boolean>;

  private selectedEmployeeSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private organizationsService: OrganizationsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
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

  onSelect(employees: IEmployee[]): void {
    const userId = isEmpty(employees)
      ? null
      : employees[0].userId;
    this.organizationsService.selectEmployee(userId);
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
