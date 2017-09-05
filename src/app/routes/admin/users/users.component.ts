import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';

import { IGridColumn, IRenderer } from '../../../shared/components/grid/grid.interface';
import { IOption } from '../../../core/converter/value-converter.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../shared/components/toolbar-2/toolbar-2.interface';
import { IUser, IUsersState } from './users.interface';

import { ContentTabService } from '../../../shared/components/content-tabstrip/tab/content-tab.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { LookupService } from '../../../core/lookup/lookup.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    { prop: 'isBlocked', minWidth: 100 },
    { prop: 'mobPhone', minWidth: 140 },
    { prop: 'workPhone', minWidth: 140 },
    { prop: 'intPhone', minWidth: 140 },
    { prop: 'email', minWidth: 120 },
    { prop: 'languageId', minWidth: 120 },
  ];

  renderers: IRenderer = {
    roleId: [],
    isBlocked: 'checkboxRenderer',
    languageId: [],
  };

  displayBlockedUsers: boolean;

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
      action: () => this.usersService.fetch(),
      enabled: this.userPermissionsService.has('USER_VIEW')
    },
    {
      type: ToolbarItemTypeEnum.CHECKBOX,
      action: () => this.usersService.toggleBlockedFilter(),
      label: 'users.toolbar.action.show_blocked_users',
      state: this.usersService.state.map(state => state.displayBlocked)
    }
  ];

  editedEntity: IUser;

  roleOptions$: Observable<IOption[]>;
  languageOptions$: Observable<Array<IOption>>;

  users$: Observable<Array<IUser>>;

  emptyMessage$: Observable<string>;

  private hasViewPermission$: Observable<boolean>;

  private usersSubscription: Subscription;
  private optionsSubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  constructor(
    private contentTabService: ContentTabService,
    private gridService: GridService,
    private lookupService: LookupService,
    private userPermissionsService: UserPermissionsService,
    private usersService: UsersService,
  ) {
    this.roleOptions$ = this.lookupService.roleOptions;
    this.languageOptions$ = this.lookupService.languageOptions;

    this.optionsSubscription = Observable.combineLatest(this.roleOptions$, this.languageOptions$)
      .subscribe(([ roleOptions, languageOptions ]) => {
        this.renderers.roleId = [].concat(roleOptions);
        this.renderers.languageId = [].concat(languageOptions);
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      });

    this.filter = this.filter.bind(this);

    this.usersSubscription = this.usersService.state.distinctUntilChanged()
      .subscribe(
        state => {
          this.displayBlockedUsers = state.displayBlocked;
          this.editedEntity = (state.users || []).find(users => users.id === state.selectedUserId);
        }
      );

    this.hasViewPermission$ = this.userPermissionsService.has('USER_VIEW');
    this.viewPermissionSubscription = this.hasViewPermission$.subscribe(hasViewPermission =>
      hasViewPermission ? this.usersService.fetch() : this.usersService.clear()
    );

    this.users$ = this.usersService.state.map(state => state.users);

    this.emptyMessage$ = this.hasViewPermission$.map(hasPermission => hasPermission ? null : 'users.errors.view');
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.optionsSubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  get state(): Observable<IUsersState> {
    return this.usersService.state;
  }

  filter(user: IUser): boolean {
    return !user.isBlocked || this.displayBlockedUsers;
  }

  onAdd(): void {
    this.contentTabService.navigate('/admin/users/create');
  }

  onEdit(user?: IUser): void {
    const id = user ? user.id : this.editedEntity.id;
    this.contentTabService.navigate(`/admin/users/${id}`);
  }

  onSelect(user: IUser): void {
    if (user) {
      this.usersService.select(user.id);
    }
  }
}
