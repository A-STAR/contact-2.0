import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGroup } from './group.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class GroupService {

  private baseUrl = '/groups';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('GROUP_VIEW');
  }

  fetchAll(): Observable<Array<IGroup>> {
    return this.dataService.readAll(`${this.baseUrl}`)
      .catch(this.notificationsService.fetchError().entity('entities.entityGroup.gen.plural').dispatchCallback());
  }
}
