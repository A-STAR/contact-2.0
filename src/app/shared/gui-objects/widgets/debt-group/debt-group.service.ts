import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEntityGroup } from '../entity-group/entity-group.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class DebtGroupService {
  static ACTION_DEBT_GROUP_ADD = 'objectAddToGroup';

  private entityTypeId = 19;
  private url = `mass/entityType/${this.entityTypeId}/groups/{groupId}/add`;

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('ADD_TO_GROUP_ENTITY_LIST');
  }

  addToGroup(debts: number[], group: IEntityGroup): Observable<any> {
    return this.dataService
      .create(this.url, {}, {})
      .catch(this.notificationsService.updateError().entity('entities.entityGroup.gen.singular').dispatchCallback());
  }
}
