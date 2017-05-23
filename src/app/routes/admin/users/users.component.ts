import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { GridComponent } from '../../../shared/components/grid/grid.component';
import { GridColumnDecoratorService } from '../../../shared/components/grid/grid.column.decorator.service';
import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { IUser, IUsersResponse } from './users.interface';
import { IToolbarAction, ToolbarActionTypeEnum, ToolbarControlEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html'
})
export class UsersComponent implements AfterViewInit {
  @ViewChild(GridComponent) grid: GridComponent;

  columns: Array<any> = [
    { prop: 'id', minWidth: 50, maxWidth: 70, disabled: true },
    { prop: 'login', minWidth: 120 },
    { prop: 'lastName', minWidth: 120 },
    { prop: 'firstName', minWidth: 120 },
    { prop: 'middleName', minWidth: 120 },
    { prop: 'position', minWidth: 120 },
    this.columnDecoratorService.decorateRelatedEntityColumn(
      { prop: 'roleId', minWidth: 100 }, this.usersService.getRoles()
    ),
    this.columnDecoratorService.decorateLocalizedColumn(
      // TODO: display column depending on filter
      { prop: 'isBlocked', minWidth: 100 },
      ({ isBlocked }) => isBlocked ? 'default.boolean.TRUE' : 'default.boolean.FALSE'
    ),
    { prop: 'mobPhone', minWidth: 140 },
    { prop: 'workPhone', minWidth: 140 },
    { prop: 'intPhone', minWidth: 140 },
    { prop: 'email', minWidth: 120 },
    this.columnDecoratorService.decorateRelatedEntityColumn(
      { prop: 'languageId', minWidth: 120 }, this.usersService.getLanguages()
    ),
  ];

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

  selectedUser: IUser = null;

  currentUser: IUser = null;

  action: ToolbarActionTypeEnum = null;

  constructor(
    private columnDecoratorService: GridColumnDecoratorService,
    private usersService: UsersService) {
    this.filter = this.filter.bind(this);
  }

  ngAfterViewInit(): void {
    this.grid.onRowsChange.subscribe(() => this.refreshToolbar());
  }

  filter(user: IUser): boolean {
    return !user.isBlocked || this.displayBlockedUsers;
  }

  parseFn(data: IUsersResponse): Array<IUser> {
    return data.users;
  }

  get isUserBeingCreatedOrEdited(): boolean {
    return this.currentUser && this.action !== null;
  }

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

  onEdit(user: IUser): void {
    this.action = ToolbarActionTypeEnum.EDIT;
    this.currentUser = this.selectedUser;
  }

  onUpdate(): void {
    this.selectedUser = null;
    this.grid.load().
      subscribe(
        () => {},
        // TODO: display & log a message
        err => console.error(err)
      );
  }

  onSelect(users: Array<IUser>): void {
    const user = users[0];
    if (user && user.id && (this.selectedUser && this.selectedUser.id !== user.id || !this.selectedUser)) {
      this.selectUser(user);
    }
  }

  private selectUser(user: IUser): void {
    this.selectedUser = user;
    this.refreshToolbar();
  }

  private refreshToolbar(): void {
    this.actions
      .find((action: IToolbarAction) => action.type === ToolbarActionTypeEnum.EDIT)
      .visible = !!this.selectedUser;

    this.actions.find((action: IToolbarAction) => action.type === ToolbarActionTypeEnum.REFRESH)
      .visible = this.grid.rows.length > 0;
  }

  private createEmptyUser(): IUser {
    return {
      id: null,
      login: '',
      roleId: null,
      firstName: '',
      middleName: '',
      lastName: '',
      comment: '',
      email: '',
      workPhone: '',
      mobPhone: '',
      intPhone: '',
      workAddress: '',
      position: '',
      startWorkDate: '',
      endWorkDate: '',
      languageId: null,
      isBlocked: false
    };
  }
}
