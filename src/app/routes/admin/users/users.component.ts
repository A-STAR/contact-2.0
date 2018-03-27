import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IUser, IUsersState } from '@app/routes/admin/users/users.interface';

import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { UsersService } from '@app/routes/admin/users/users.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { combineLatestAnd, isEmpty, addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-users',
  templateUrl: 'users.component.html',
})
export class UsersComponent implements OnInit, OnDestroy {
  private _users: Array<IUser> = [];
  private selectedUserId: number;

  columns: ISimpleGridColumn<IUser>[] = [
    { prop: 'id', minWidth: 50, maxWidth: 70 /*, disabled: true */ },
    { prop: 'login', minWidth: 120 },
    { prop: 'lastName', minWidth: 120 },
    { prop: 'firstName', minWidth: 120 },
    { prop: 'middleName', minWidth: 120 },
    { prop: 'position', minWidth: 120 },
    { prop: 'roleId', minWidth: 100, lookupKey: 'roles' },
    { prop: 'isInactive', minWidth: 100, renderer: TickRendererComponent },
    { prop: 'mobPhone', minWidth: 140 },
    { prop: 'workPhone', minWidth: 140 },
    { prop: 'intPhone', minWidth: 140 },
    { prop: 'email', minWidth: 120 },
    { prop: 'languageId', minWidth: 120, lookupKey: 'languages' },
    { prop: 'branchCode', minWidth: 120, dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
  ].map(addGridLabel('routes.admin.users.grid')) as ISimpleGridColumn<IUser>[];

  displayInactiveUsers: boolean;

  titlebar: ITitlebar = {
    title: 'users.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_ADD,
        action: () => this.onAdd(),
        enabled: this.userPermissionsService.hasOne([ 'USER_ADD' ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_EDIT,
        action: () => this.onEdit({ id: this.selectedUserId } as any),
        enabled: combineLatestAnd([
          this.userPermissionsService.hasOne([ 'USER_EDIT', 'USER_ROLE_EDIT', 'USER_LDAP_LOGIN_EDIT' ]),
          this.usersService.state.map(state => !!state.selectedUserId)
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetch(),
        enabled: this.userPermissionsService.has('USER_VIEW')
      },
      // TODO(a.tymchuk): implement a dropdown settings button with options
      // {
      //   type: ToolbarItemTypeEnum.CHECKBOX,
      //   action: () => this.toggleInactiveFilter(),
      //   label: 'users.toolbar.action.show_inactive_users',
      //   state: this.usersService.state.map(state => state.displayInactive)
      // }
    ]
  };

  emptyMessage$: Observable<string>;

  private actionSubscription: Subscription;
  private hasViewPermission$: Observable<boolean>;
  private selectedUserSubscription: Subscription;
  private filterUserSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.filter = this.filter.bind(this);

    this.selectedUserSubscription = this.state
      .subscribe(state => this.selectedUserId = state.selectedUserId);

    this.filterUserSubscription = this.state
      .map(state => state.displayInactive)
      .distinctUntilChanged()
      .subscribe(
        displayInactive => {
          this.displayInactiveUsers = displayInactive;
          this.refresh();
        }
      );

    this.hasViewPermission$ = this.userPermissionsService.has('USER_VIEW');
    this.viewPermissionSubscription = this.hasViewPermission$.subscribe(canView =>
      canView ? this.fetch() : this.clear()
    );

    this.emptyMessage$ = this.hasViewPermission$.map(canView => canView ? null : 'users.errors.view');

    this.actionSubscription = this.usersService
      .getAction(UsersService.USER_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
    this.selectedUserSubscription.unsubscribe();
    this.filterUserSubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  get state(): Observable<IUsersState> {
    return this.usersService.state;
  }

  get users(): IUser[] {
    return this._users;
  }

  set users(users: IUser[]) {
    this._users = users;
  }

  get editedUser(): IUser {
    return (this.users || []).find(user => user.id === this.selectedUserId);
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
    this.routingService.navigate([ 'create' ], this.route);
  }

  onEdit(user: IUser): void {
    this.routingService.navigate([ String(user.id) ], this.route);
  }

  onSelect(users: IUser[]): void {
    if (!isEmpty(users)) {
      this.usersService.select(users[0].id);
    }
  }

  private fetch(): void {
    this.usersService.fetch().subscribe(users => {
      this.users = users;
      this.cdRef.markForCheck();
    });
  }

  private refresh(): void {
    this.users = [].concat(this.users);
    this.cdRef.markForCheck();
  }

  private clear(): void {
    this.users = [];
    this.cdRef.markForCheck();
  }
}
