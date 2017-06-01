import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUser } from './users.interface';
import { IToolbarAction, ToolbarActionTypeEnum, ToolbarControlEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { IDataSource, IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';

import { ConstantsService } from '../../../core/constants/constants.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { UsersService } from './users.service';

import { GridEntityComponent } from '../../../shared/components/entity/grid.entity.component';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html'
})
export class UsersComponent extends GridEntityComponent<IUser> {
  static COMPONENT_NAME = 'UsersComponent';

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 70, disabled: true },
    { prop: 'login', minWidth: 120 },
    { prop: 'lastName', minWidth: 120 },
    { prop: 'firstName', minWidth: 120 },
    { prop: 'middleName', minWidth: 120 },
    { prop: 'position', minWidth: 120 },
    { prop: 'roleId', minWidth: 100 },
    // TODO: display column depending on filter
    { prop: 'isBlocked', minWidth: 100, localized: true },
    { prop: 'mobPhone', minWidth: 140 },
    { prop: 'workPhone', minWidth: 140 },
    { prop: 'intPhone', minWidth: 140 },
    { prop: 'email', minWidth: 120 },
    { prop: 'languageId', minWidth: 120 },
  ];

  renderers: IRenderer = {
    roleId: [],
    isBlocked: ({ isBlocked }) => isBlocked ? 'default.boolean.TRUE' : 'default.boolean.FALSE',
    languageId: [],
  };

  dataSource: IDataSource = {
    read: '/api/users',
    update: '/api/users/{id}',
    dataKey: 'users',
  };

  displayBlockedUsers = false;

  actions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'USER_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: ['USER_EDIT', 'USER_ROLE_EDIT'] },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
    {
      text: 'users.toolbar.action.show_blocked_users',
      type: 10,
      visible: true,
      control: ToolbarControlEnum.CHECKBOX,
      value: this.displayBlockedUsers
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private gridService: GridService,
    // TODO: temp solution; move to resolver
    private constantsService: ConstantsService,
    private usersService: UsersService,
  ) {
    super();
    const [ roles, languages ] = this.route.snapshot.data.users;
    this.renderers.roleId = [].concat(roles);
    this.renderers.languageId = [].concat(languages);
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.filter = this.filter.bind(this);
  }

  filter(user: IUser): boolean {
    return !user.isBlocked || this.displayBlockedUsers;
  }

  onAddSubmit(data: any): void {
    this.usersService
      .create(data)
      .subscribe(
        () => this.onSubmitSuccess(),
        // () => this.notificationsActions.error('organizations.employees.add.errorMessage')
      );
  }

  onEditSubmit(data: any): void {
    this.usersService
      .save(this.selectedEntity.id, data)
      .subscribe(
        () => this.onSubmitSuccess(),
        // () => this.notificationsActions.error('organizations.employees.edit.errorMessage')
      );
  }

  private onSubmitSuccess(): void {
    this.afterUpdate();
    this.cancelAction();
  }

  /*
  onAction(action: IToolbarAction): void {
    this.action = action.type;
    switch (action.type) {
      case ToolbarActionTypeEnum.REFRESH:
        this.onUpdate();
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.currentUser = this.selectedUser;
        break;
      case ToolbarActionTypeEnum.ADD:
        this.currentUser = this.createEmptyUser();
        break;
      // FIXME omg!
      case 10:
        this.displayBlockedUsers = action.value;
        break;
    }
  }
  */
}
