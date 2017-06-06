import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../core/state/state.interface';
import { IUser, IUserDialogActionEnum, IUsersState } from './users.interface';
import { IToolbarItem, ToolbarToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';
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

  displayBlockedUsers: boolean;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarToolbarItemTypeEnum.BUTTON,
      action: () => this.usersService.setDialogAddAction(),
      icon: 'fa fa-plus',
      label: 'toolbar.action.add',
      permissions: [ 'USER_ADD' ]
    },
    {
      type: ToolbarToolbarItemTypeEnum.BUTTON,
      action: () => this.usersService.setDialogEditAction(),
      icon: 'fa fa-pencil',
      label: 'toolbar.action.edit',
      permissions: [ 'USER_EDIT' ],
      disabled: (state: IAppState) => state.users.selectedUserId === null
    },
    {
      type: ToolbarToolbarItemTypeEnum.BUTTON,
      action: () => this.usersService.fetch(),
      icon: 'fa fa-refresh',
      label: 'toolbar.action.refresh',
      permissions: [ 'USER_VIEW' ]
    },
    {
      type: ToolbarToolbarItemTypeEnum.CHECKBOX,
      action: () => this.usersService.toggleBlockedFilter(),
      label: 'users.toolbar.action.show_blocked_users',
      state: (state: IAppState) => state.users.displayBlocked
    }
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
          this.displayBlockedUsers = state.displayBlocked;
          this.action = state.dialogAction;
          this.editedEntity = state.users.find(users => users.id === state.selectedUserId);
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
}
