import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEntityGroup } from '../entity-group/entity-group.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class EntityGroupService {
  static MESSAGE_ENTITY_GROUP_SELECTED = 'MESSAGE_ENTITY_GROUP_SELECTED';
  static ACTION_ENTITY_GROUP_ADD = 'objectAddToGroup';

  private url = '/filters/groups?entityTypeIds={entityTypeId}&isManual={isManual}';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  getCanAdd$(entityTypeId: number): Observable<boolean> {
    return this.userPermissionsService.contains('ADD_TO_GROUP_ENTITY_LIST', entityTypeId);
  }

  fetchAll(entityTypeId: number, isManual: boolean = false): Observable<IEntityGroup[]> {
    return this.dataService
      .readAll(this.url, { entityTypeId, isManual: isManual ? 1 : 0 })
      .catch(this.notificationsService.fetchError().entity('entities.entityGroup.gen.plural').dispatchCallback());
  }

  addToGroup(entityTypeId: number, groupId: number, debts: number[]): Observable<any> {
    return this.dataService
      .create(`/mass/entityType/{entityTypeId}/groups/{groupId}/add`, { entityTypeId, groupId }, { idData: { ids: debts } })
      .do(res => {
        if (!res.success) {
          this.notificationsService.warning().entity('default.dialog.result.messageUnsuccessful').response(res).dispatch();
        } else {
          this.notificationsService.info().entity('default.dialog.result.message').response(res).dispatch();
        }
      })
      .catch(this.notificationsService.updateError().entity('entities.entityGroup.gen.singular').dispatchCallback());
  }
}
