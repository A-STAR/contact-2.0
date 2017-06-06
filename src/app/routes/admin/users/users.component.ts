import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IUser, IUserDialogActionEnum, IUsersState } from './users.interface';
import { IToolbarAction, ToolbarActionTypeEnum, ToolbarControlEnum } from '../../../shared/components/toolbar/toolbar.interface';
import { IDataSource, IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnDestroy {
  static COMPONENT_NAME = 'UsersComponent';

  // TODO: custom toolbar actions
  private DISPLAY_BLOCKED_ACTION = -1;

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

  toolbarActions: Array<IToolbarAction> = [
    { text: 'toolbar.action.add', type: ToolbarActionTypeEnum.ADD, visible: true, permission: 'USER_ADD' },
    { text: 'toolbar.action.edit', type: ToolbarActionTypeEnum.EDIT, visible: false, permission: ['USER_EDIT', 'USER_ROLE_EDIT'] },
    { text: 'toolbar.action.refresh', type: ToolbarActionTypeEnum.REFRESH },
    {
      text: 'users.toolbar.action.show_blocked_users',
      type: this.DISPLAY_BLOCKED_ACTION,
      visible: true,
      control: ToolbarControlEnum.CHECKBOX,
      value: this.displayBlockedUsers,
      hasLabel: true
    }
  ];

  toolbarActionsGroup: Array<ToolbarActionTypeEnum> = [
    ToolbarActionTypeEnum.EDIT,
  ];

  action: IUserDialogActionEnum;

  editedEntity: IUser;

  private _roles;

  private _languages;

  private users$: Subscription;

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) {
    const { roles, languages } = this.route.snapshot.data.users;
    this._roles = roles;
    this._languages = languages;
    this.renderers.roleId = [].concat(roles);
    this.renderers.languageId = [].concat(languages);
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    this.filter = this.filter.bind(this);

    this.usersService.fetch();

    this.users$ = this.usersService.state
      .subscribe(
        state => {
          this.action = state.dialogAction;
          this.editedEntity = state.users.find(users => users.id === state.selectedUserId);
          this.refreshToolbar(!!state.selectedUserId, state.users.length > 0);
        },
        // TODO: notifications
        error => console.error(error)
      );
  }

  ngOnDestroy(): void {
    this.users$.unsubscribe();
  }

  get isEntityBeingCreated(): boolean {
    return this.action === IUserDialogActionEnum.USER_ADD;
  }

  get isEntityBeingEdited(): boolean {
    return this.action === IUserDialogActionEnum.USER_EDIT;
  }

  get state(): Observable<IUsersState> {
    return this.usersService.state;
  }

  get roles(): Array<any> {
    return this._roles;
  }

  get languages(): Array<any> {
    return this._languages;
  }

  filter(user: IUser): boolean {
    return !user.isBlocked || this.displayBlockedUsers;
  }

  onAddSubmit(data: any): void {
    this.usersService.create(data);
  }

  onEditSubmit(data: any): void {
    this.usersService.update(data);
  }

  cancelAction(): void {
    this.usersService.setDialogAction(null);
  }

  onEdit(): void {
    this.usersService.setDialogAction(IUserDialogActionEnum.USER_EDIT);
  }

  onSelectedRowChange(users: Array<IUser>): void {
    const user = users[0];
    if (user) {
      this.usersService.select(user.id);
    }
  }

  onAction(action: IToolbarAction): void {
    switch (action.type) {
      case ToolbarActionTypeEnum.ADD:
        this.usersService.setDialogAction(IUserDialogActionEnum.USER_ADD);
        break;
      case ToolbarActionTypeEnum.EDIT:
        this.usersService.setDialogAction(IUserDialogActionEnum.USER_EDIT);
        break;
      case ToolbarActionTypeEnum.REFRESH:
        this.usersService.fetch();
        break;
      case this.DISPLAY_BLOCKED_ACTION:
        this.displayBlockedUsers = action.value;
        break;
    }
  }

  private refreshToolbar(isUserSelected: boolean, hasData: boolean): void {
    this.setActionsVisibility(this.toolbarActionsGroup, isUserSelected);

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
