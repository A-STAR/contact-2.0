import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IDataSource, IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';
import { IUser, IUserDialogActionEnum, IUsersState } from './users.interface';
import { IUserConstant } from '../../../core/user/constants/user-constants.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';
import { PermissionsService } from '../../../core/permissions/permissions.service';
import { UserConstantsService } from '../../../core/user/constants/user-constants.service';
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
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.usersService.setDialogAddAction(),
      enabled: this.permissionsService.hasPermission([ 'USER_EDIT', 'USER_ROLE_EDIT' ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.usersService.setDialogEditAction(),
      enabled: Observable.combineLatest(
        this.permissionsService.hasPermission([ 'USER_EDIT', 'USER_ROLE_EDIT' ]),
        this.usersService.state.map(state => !!state.selectedUserId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.usersService.fetch(),
      enabled: this.permissionsService.hasPermission('USER_VIEW')
    },
    {
      type: ToolbarItemTypeEnum.CHECKBOX,
      action: () => this.usersService.toggleBlockedFilter(),
      label: 'users.toolbar.action.show_blocked_users',
      state: this.usersService.state.map(state => state.displayBlocked)
    }
  ];

  action: IUserDialogActionEnum;

  editedEntity: IUser;

  passwordMinLength$: Observable<IUserConstant>;
  passwordComplexity$: Observable<IUserConstant>;

  private _languages;

  private users$: Subscription;

  private canAddUser$: Observable<boolean>;

  // TODO(d.maltsev): role options type
  roleOptions$: Observable<any>;

  constructor(
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private permissionsService: PermissionsService,
    private userConstantsService: UserConstantsService,
    private usersService: UsersService,
  ) {
    // TODO(d.maltsev): remove languages from resolver
    const { languages } = this.route.snapshot.data.users;
    this._languages = languages;

    // TODO(d.maltsev):
    // preload roles in resolver or create PermissionsService.refreshRoles method
    // that only loads roles if they are not already loaded
    this.permissionsService.fetchRoles();

    this.roleOptions$ = this.permissionsService.permissions.map(state => state.roles.map(role => ({
      label: role.name,
      value: role.id
    })));

    this.roleOptions$.subscribe(options => {
      this.renderers.roleId = [].concat(options);
      this.renderers.languageId = [].concat(languages);
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
    });

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

    this.canAddUser$ = this.permissionsService.hasPermission('USER_ADD');

    // TODO(d.maltsev):
    // preload constants in resolver or create ConstantsService.refresh method
    // that only loads constants if they are not already loaded
    // this.constantsService.fetch();
    this.passwordMinLength$ = this.userConstantsService.get('UserPassword.MinLength');
    this.passwordComplexity$ = this.userConstantsService.get('UserPassword.Complexity.Use');
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

  get languages(): Array<any> {
    return this._languages;
  }

  filter(user: IUser): boolean {
    return !user.isBlocked || this.displayBlockedUsers;
  }

  onAddSubmit(data: any): void {
    const { image, ...user } = data;
    this.usersService.create(user, image);
  }

  onEditSubmit(data: any): void {
    const { image, ...user } = data;
    this.usersService.update(user, image);
  }

  cancelAction(): void {
    this.usersService.setDialogAction(null);
  }

  onEdit(user: IUser): void {
    this.usersService.setDialogAction(IUserDialogActionEnum.USER_EDIT, user.id);
  }

  onSelect(user: IUser): void {
    if (user) {
      this.usersService.select(user.id);
    }
  }
}
