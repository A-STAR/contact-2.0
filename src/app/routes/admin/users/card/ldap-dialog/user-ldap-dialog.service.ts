import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ILdapGroup, ILdapUser } from './user-ldap-dialog.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class UserLdapDialogService {
  constructor(private dataService: DataService) {}

  readLdapGroups(): Observable<ILdapGroup[]> {
    return this.dataService.readAll('/ldapgroups');
  }

  readLdapUsers(groupName: string): Observable<ILdapUser[]> {
    return this.dataService.readAll('/ldapgroups/{groupName}/users', { groupName });
  }
}
