import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IEmployeeUser, IEmployee, IOrganizationDialogActionEnum, IOrganizationsState } from '../organizations.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { OrganizationsService } from '../organizations.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent {
  @Input() employees: Array<IEmployee>;
  @ViewChild(GridComponent) grid: GridComponent;

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: false, permission: 'ORGANIZATION_EDIT' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ORGANIZATION_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ORGANIZATION_EDIT' },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
  ];

  toolbarActionsMasterGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.ADD,
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
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

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService
  ) {
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);

    // TODO: unsubscribe
    this.organizationsService.state
      .subscribe(
        state => {
          this.action = state.dialogAction;
          this.editedEntity = state.employees.data.find(employee => employee.userId === state.employees.selectedUserId);
          this.refreshToolbar(!!state.organizations.selectedId, !!state.employees.selectedUserId, state.employees.data.length > 0);
        },
        // TODO: notifications
        error => console.error(error)
      );
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

  onSelectedRowChange(employees: Array<IEmployee>): void {
    const employee = employees[0];
    if (employee) {
      this.organizationsService.selectEmployee(employee.userId);
    }
  }

  onAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.organizationsService.fetchEmployees();
        break;
      case ToolbarActionTypeEnum.ADD:
        this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_ADD);
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_EDIT);
        break;
      case ToolbarActionTypeEnum.REMOVE:
        this.organizationsService.setDialogAction(IOrganizationDialogActionEnum.EMPLOYEE_REMOVE);
        break;
      default:
        this.organizationsService.setDialogAction(null);
    }
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

  private refreshToolbar(isOrganizationSelected: boolean, isEmployeeSelected: boolean, hasData: boolean): void {
    this.setActionsVisibility(this.toolbarActionsGroup, isEmployeeSelected);
    if (Array.isArray(this.toolbarActionsMasterGroup)) {
      this.setActionsVisibility(this.toolbarActionsMasterGroup, isOrganizationSelected);
    }

    const refreshAction: IToolbarAction = this.findToolbarActionByType(ToolbarActionTypeEnum.REFRESH);
    if (refreshAction) {
      refreshAction.visible = hasData;
    }
  }

  private setActionsVisibility(actionTypesGroup: Array<ToolbarActionTypeEnum>, visible: boolean): void {
    actionTypesGroup.forEach((actionType: ToolbarActionTypeEnum) =>
      this.findToolbarActionByType(actionType).visible = visible);
  }

  private findToolbarActionByType(actionType: ToolbarActionTypeEnum): IToolbarAction {
    return this.toolbarActions.find((action: IToolbarAction) => actionType === action.type);
  }
}
