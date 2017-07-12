import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { ILdapGroup, ILdapUser } from './user-ldap-dialog.interface';

import { UserLdapDialogService } from './user-ldap-dialog.service';

@Component({
  selector: 'app-user-ldap-dialog',
  templateUrl: './user-ldap-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLdapDialogComponent {
  groupsColumns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'comment' },
  ];

  usersColumns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'fullName' },
    { prop: 'isBlocked' },
    { prop: 'comment' },
  ];

  groups$: Observable<Array<ILdapGroup>>;
  users$: Observable<Array<ILdapUser>>;

  private selectedUser: ILdapUser = null;

  constructor(private userLdapDialogService: UserLdapDialogService) {
    this.groups$ = this.userLdapDialogService.readLdapGroups()
      .map(response => response.groups);
  }

  onGroupSelect(group: ILdapGroup): void {
    this.users$ = this.userLdapDialogService.readLdapUsers(group.name)
      .map(response => response.users);
  }

  onUserSelect(user: ILdapUser): void {
    this.selectedUser = user;
  }
}
