import { Component } from '@angular/core';

import { IDataSource } from '../../../../shared/components/grid/grid.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { GridEntityComponent } from '../../../../shared/components/entity/grid.entity.component';
import { IEmployee } from '../organizations.interface';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html'
})
export class EmployeesComponent extends GridEntityComponent<IEmployee> {
  get info(): string {
    return JSON.stringify(this.masterEntity, null, 2);
  }

  bottomActions: Array<IToolbarAction> = [
    { text: 'TOOLBAR.ACTION.ADD', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'ORGANIZATION_EDIT' },
    { text: 'TOOLBAR.ACTION.EDIT', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: 'ORGANIZATION_EDIT' },
    { text: 'TOOLBAR.ACTION.REMOVE', type: ToolbarActionTypeEnum.REMOVE, visible: false, permission: 'ORGANIZATION_EDIT' },
  ];

  bottomActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
    ToolbarActionTypeEnum.REMOVE,
  ];

  columns: Array<any> = [
    { name: 'ID', prop: 'id', minWidth: 30, maxWidth: 70 },
    { name: 'User ID', prop: 'userId', maxWidth: 400 },
    { name: 'Role Code', prop: 'roleCode' },
    { name: 'Comment', prop: 'comment' },
  ];

  dataSource: IDataSource = {
    read: '/api/organizations/{id}/users',
    // update: '/api/terms',
    dataKey: 'organizationUserLinks',
  };
}
