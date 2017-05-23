import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';
import { OrganizationsService } from '../organizations.service';
import { EmployeesService } from './employees.service';
import { IEmployeeUser } from '../organizations.interface';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent extends GridEntityComponent<IEmployeeUser> {
  bottomActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'ORGANIZATION_EDIT' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ORGANIZATION_EDIT' },
    { text: 'toolbar.action.remove', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ORGANIZATION_EDIT' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    this.columnDecoratorService.decorateColumn(
      { prop: 'fullName', minWidth: 150 },
      (employee: IEmployeeUser) => `${employee.lastName || ''} ${employee.firstName || ''} ${employee.middleName || ''}`
    ),
    { prop: 'position', minWidth: 100 },
    this.columnDecoratorService.decorateColumn(
      // TODO: dictionary service
      { prop: 'roleCode', minWidth: 100 }, (column, roleCode: number) => {
        switch (roleCode) {
          case 1: return 'Сотрудник';
          case 2: return 'Руководитель';
          case 3: return 'Заместитель';
          case 4: return 'Куратор';
        }
        return roleCode;
      }
    ),
    this.columnDecoratorService.decorateColumn(
      // TODO: display column depending on filter
      { prop: 'isBlocked', minWidth: 100 }, ({ isBlocked }) => this.transformIsBlocked(isBlocked)
    ),
  ];

  dataSource: IDataSource = {
    read: '/api/organizations/{id}/users',
    dataKey: 'users',
  };

  constructor(
    private employeesService: EmployeesService,
    private columnDecoratorService: GridColumnDecoratorService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService) {

    super();
  }

  transformIsBlocked(isBlocked: number): string {
    // TODO: render checkbox
    return this.translateService.instant(isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No');
  }

  onAddSubmit(data: any): void {
    this.employeesService
      .create(this.masterEntity.id, data)
      .subscribe(
        // TODO: reload grid
        // TODO: handle errors
      );
  }

  onEditSubmit(data: IEmployeeUser): void {
    this.employeesService
      .save(this.masterEntity.id, this.selectedEntity.userId, {
        roleCode: data.roleCode, //data.roleCode[0].id,
        comment: data.comment
      })
      .subscribe(
        // TODO: reload grid
        // TODO: handle errors
      );
  }

  onRemoveSubmit(data: any): void {
    //
  }
}