import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ILdapGroupsResponse, ILdapUsersResponse } from './user-ldap-dialog.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class UserLdapDialogService {
  constructor(private dataService: DataService) {}

  readLdapGroups(): Observable<ILdapGroupsResponse> {
    return this.dataService.read('/ldapgroups');
  }

  readLdapUsers(groupName: string): Observable<ILdapUsersResponse> {
    return this.dataService.read('/ldapgroups/{groupName}/users', { groupName });
  }
}
