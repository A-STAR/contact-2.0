import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone, IPhonesResponse } from './phone.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class PhoneService {
  static MESSAGE_PHONE_SAVED = 'MESSAGE_PHONE_SAVED';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IPhone>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/phones', { entityType, entityId })
      .map((response: IPhonesResponse) => response.phones)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.phones.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, phoneId: number): Observable<IPhone> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}', { entityType, entityId, phoneId })
      .map((response: IPhonesResponse) => response.phones[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.phones.gen.singular').dispatchCallback());
  }

  create(entityType: number, entityId: number, phone: IPhone): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/phones/', { entityType, entityId }, phone)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.phones.gen.singular').dispatchCallback());
  }

  update(entityType: number, entityId: number, phoneId: number, phone: Partial<IPhone>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}', { entityType, entityId, phoneId }, phone)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.phones.gen.singular').dispatchCallback());
  }

  block(entityType: number, entityId: number, phoneId: number, blockReasonCode: number): Observable<void> {
    return this.update(entityType, entityId, phoneId, { isBlocked: 1, blockReasonCode });
  }

  unblock(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.update(entityType, entityId, phoneId, { isBlocked: 0 });
  }

  delete(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.dataService
      .delete('/api/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}', { entityType, entityId, phoneId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.phones.gen.singular').dispatchCallback());
  }
}
