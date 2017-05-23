import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { GridColumnDecoratorService } from '../../../../shared/components/grid/grid.column.decorator.service';
import { OrganizationsService } from '../organizations.service';
import { IEmployee } from '../organizations.interface';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent extends GridEntityComponent<IEmployee> {
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
      { prop: 'fullName', minWidth: 200 },
      (employee: IEmployee) => `${employee.lastName || ''} ${employee.firstName || ''} ${employee.middleName || ''}`
    ),
    { prop: 'position' },
    this.columnDecoratorService.decorateColumn(
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
    // update: '/api/terms',
    dataKey: 'users',
  };

  constructor(
    private columnDecoratorService: GridColumnDecoratorService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService) {

    super();
  }

  transformIsBlocked(isBlocked: number): string {
    // TODO: render checkbox
    return this.translateService.instant(isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No');
  }

}
