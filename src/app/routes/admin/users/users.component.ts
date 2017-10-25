import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn } from '../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';
import { IUser, IUsersState } from './users.interface';

import { GridService } from '../../../shared/components/grid/grid.service';
import { MessageBusService } from '../../../core/message-bus/message-bus.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnDestroy {
  static COMPONENT_NAME = 'UsersComponent';

  private _users: Array<IUser> = [];
  private _selectedUserId: number;

  columns: Array<IGridColumn> = [
    { prop: 'id', minWidth: 50, maxWidth: 70, disabled: true },
    { prop: 'login', minWidth: 120 },
    { prop: 'lastName', minWidth: 120 },
    { prop: 'firstName', minWidth: 120 },
    { prop: 'middleName', minWidth: 120 },
    { prop: 'position', minWidth: 120 },
    { prop: 'roleId', minWidth: 100, lookupKey: 'roles' },
    { prop: 'isInactive', minWidth: 100, renderer: 'checkboxRenderer' },
    { prop: 'mobPhone', minWidth: 140 },
    { prop: 'workPhone', minWidth: 140 },
    { prop: 'intPhone', minWidth: 140 },
    { prop: 'email', minWidth: 120 },
    { prop: 'languageId', minWidth: 120, lookupKey: 'languages' },
  ];

  displayInactiveUsers: boolean;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.userPermissionsService.hasOne([ 'USER_EDIT', 'USER_ROLE_EDIT' ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: Observable.combineLatest(
        this.userPermissionsService.hasOne([ 'USER_EDIT', 'USER_ROLE_EDIT' ]),
        this.usersService.state.map(state => !!state.selectedUserId)
      ).map(([hasPermissions, hasSelectedEntity]) => hasPermissions && hasSelectedEntity)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.userPermissionsService.has('USER_VIEW')
    },
    {
      type: ToolbarItemTypeEnum.CHECKBOX,
      action: () => this.toggleInactiveFilter(),
      label: 'users.toolbar.action.show_inactive_users',
      state: this.usersService.state.map(state => state.displayInactive)
    }
  ];

  emptyMessage$: Observable<string>;

  private busSubscription: Subscription;
  private hasViewPermission$: Observable<boolean>;
  private usersSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
    private usersService: UsersService,
  ) {

    this.gridService.setAllRenderers(this.columns)
      .subscribe(columns => {
        this.columns = [ ...columns ];
      });

    this.filter = this.filter.bind(this);

    this.usersSubscription = this.state.distinctUntilChanged()
      .subscribe(
        state => {
          this.displayInactiveUsers = state.displayInactive;
          this._selectedUserId = state.selectedUserId;
          this.refresh();
        }
      );

    this.hasViewPermission$ = this.userPermissionsService.has('USER_VIEW');
    this.viewPermissionSubscription = this.hasViewPermission$.subscribe(hasViewPermission =>
      hasViewPermission ? this.fetch() : this.clear()
    );

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'users.errors.view');

    this.busSubscription = this.messageBusService
      .select(UsersService.USER_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  get state(): Observable<IUsersState> {
    return this.usersService.state;
  }

  get users(): IUser[] {
    return this._users;
  }

  get editedUser(): IUser {
    return (this._users || []).find(users => users.id === this._selectedUserId);
  }

  get selection(): Array<IUser> {
    const selectedUser = this.editedUser;
    return selectedUser ? [ selectedUser ] : [];
  }

  filter(user: IUser): boolean {
    return !user.isInactive || this.displayInactiveUsers;
  }

  toggleInactiveFilter(): void {
    this.usersService.select(null);
    this.usersService.toggleInactiveFilter();
  }

  onAdd(): void {
    this.router.navigate([ '/admin/users/create' ]);
  }

  onEdit(user?: IUser): void {
    const id = user ? user.id : this.editedUser.id;
    this.router.navigate([ `/admin/users/${id}` ]);
  }

  onSelect(user: IUser): void {
    if (user) {
      this.usersService.select(user.id);
    }
  }

  private fetch(): void {
    this.usersService.fetch().subscribe(users => {
      this._users = users;
      this.cdRef.markForCheck();
    });
  }

  private refresh(): void {
    this._users = [].concat(this._users);
    this.cdRef.markForCheck();
  }

  private clear(): void {
    this._users = [];
    this.cdRef.markForCheck();
  }
}
