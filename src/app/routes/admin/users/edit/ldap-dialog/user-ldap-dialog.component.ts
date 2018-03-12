import { ChangeDetectionStrategy, Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ILdapGroup, ILdapUser } from './user-ldap-dialog.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { UserLdapDialogService } from './user-ldap-dialog.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-user-ldap-dialog',
  templateUrl: './user-ldap-dialog.component.html',
  styleUrls: ['./user-ldap-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLdapDialogComponent implements OnInit {
  @Output() submit = new EventEmitter<string>();

  groupsColumns: ISimpleGridColumn<ILdapGroup>[] = [
    { prop: 'name' },
    { prop: 'comment' },
  ].map(addGridLabel('users.ldap.groups.grid'));

  usersColumns: ISimpleGridColumn<ILdapUser>[] = [
    { prop: 'name' },
    { prop: 'login' },
    { prop: 'isInactive', renderer: TickRendererComponent },
    { prop: 'comment' },
  ].map(addGridLabel('users.ldap.users.grid'));

  groups$: Observable<ILdapGroup[]>;
  users$: Observable<ILdapUser[]>;

  private _selectedUser: ILdapUser = null;

  constructor(
    private userLdapDialogService: UserLdapDialogService
  ) {}

  ngOnInit(): void {
    this.groups$ = this.userLdapDialogService.readLdapGroups();
  }

  get selectedUser(): ILdapUser {
    return this._selectedUser;
  }

  onGroupSelect(groups: ILdapGroup[]): void {
    this.users$ = this.userLdapDialogService.readLdapUsers(groups && groups[0].name);
  }

  onUserSelect(users: ILdapUser[]): void {
    this._selectedUser = users && users[0];
  }

  onSubmit(user: ILdapUser): void {
    this.submit.emit(user.login);
  }
}
