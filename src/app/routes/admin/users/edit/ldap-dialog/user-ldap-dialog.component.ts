import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { UsersService } from '../../users.service';

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

  groups$ = this.usersService.ldapGroups$;

  users$ = Observable.of([]);

  constructor(private usersService: UsersService) {
    this.usersService.fetchLdapGroups();
  }

  onGroupSelect(event: any): void {
    //
  }

  onUserSelect(event: any): void {
    //
  }
}
