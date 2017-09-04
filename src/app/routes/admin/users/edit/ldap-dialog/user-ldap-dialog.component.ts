import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { ILdapGroup, ILdapUser } from './user-ldap-dialog.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserLdapDialogService } from './user-ldap-dialog.service';

@Component({
  selector: 'app-user-ldap-dialog',
  templateUrl: './user-ldap-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLdapDialogComponent {
  @Output() submit = new EventEmitter<string>();

  groupsColumns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'comment' },
  ];

  usersColumns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'login' },
    { prop: 'isBlocked', renderer: 'checkboxRenderer' },
    { prop: 'comment' },
  ];

  groups$: Observable<Array<ILdapGroup>>;
  users$: Observable<Array<ILdapUser>>;

  private _selectedUser: ILdapUser = null;

  constructor(
    private gridService: GridService,
    private userLdapDialogService: UserLdapDialogService
  ) {
    this.usersColumns = this.gridService.setRenderers(this.usersColumns);
    this.groups$ = this.userLdapDialogService.readLdapGroups()
      .map(response => response.groups);
  }

  get selectedUser(): ILdapUser {
    return this._selectedUser;
  }

  onGroupSelect(group: ILdapGroup): void {
    this.users$ = this.userLdapDialogService.readLdapUsers(group.name)
      .map(response => response.users);
  }

  onUserSelect(user: ILdapUser): void {
    this._selectedUser = user;
  }

  onSubmit(user: ILdapUser): void {
    this.submit.emit(user.login);
  }
}
