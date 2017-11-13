import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IEntityGroup } from '../entity-group/entity-group.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class EntityGroupService {
  static MESSAGE_ENTITY_GROUP_SELECTED = 'MESSAGE_ENTITY_GROUP_SELECTED';

  private url = '/filters/groups';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(): Observable<IEntityGroup[]> {
    return this.dataService
      .readAll(this.url)
      .catch(this.notificationsService.fetchError().entity('entities.entityGroup.gen.plural').dispatchCallback());
  }
}
