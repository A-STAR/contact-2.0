import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/catch';

import { IDataSource, IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IEmployeeUser } from '../organizations.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { EmployeesService } from './employees.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent extends GridEntityComponent<IEmployeeUser> {
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

  dataSource: IDataSource = {
    read: '/api/organizations/{id}/users',
    dataKey: 'users',
  };

  rows = [];

  constructor(
    private employeesService: EmployeesService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) {
    super();
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);

    this.employeesService.state.subscribe(state => {
      this.rows = state.data;
    });
  }

  transformIsBlocked(isBlocked: number): string {
    return this.translateService.instant(isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No');
  }

  onAddSubmit(data: any): void {
    this.employeesService.create(this.masterEntity.id, data);
  }

  onEditSubmit(data: IEmployeeUser): void {
    this.employeesService.update(this.masterEntity.id, this.selectedEntity.userId, {
      roleCode: data.roleCode[0].value,
      comment: data.comment
    });
  }

  onRemoveSubmit(data: any): void {
     this.employeesService.delete(this.masterEntity.id, this.selectedEntity.userId);
  }
}
