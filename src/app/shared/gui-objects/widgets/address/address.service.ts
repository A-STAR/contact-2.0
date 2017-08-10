import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress, IAddressesResponse } from './address.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AddressService {
  static MESSAGE_ADDRESS_SAVED = 'MESSAGE_ADDRESS_SAVED';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IAddress>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/addresses', { entityType, entityId })
      .map((response: IAddressesResponse) => response.addresses)
      .catch(this.notificationsService.error('errors.default.read').entity('entities.addresses.gen.plural').dispatchCallback());
  }

  fetch(entityType: number, entityId: number, addressId: number): Observable<IAddress> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/addresses/{addressId}', { entityType, entityId, addressId })
      .map((response: IAddressesResponse) => response.addresses[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.addresses.gen.singular').dispatchCallback());
  }

  create(entityType: number, entityId: number, address: IAddress): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/addresses/', { entityType, entityId }, address)
      .catch(this.notificationsService.error('errors.default.create').entity('entities.addresses.gen.singular').dispatchCallback());
  }

  update(entityType: number, entityId: number, addressId: number, address: Partial<IAddress>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/addresses/{addressId}', { entityType, entityId, addressId }, address)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.addresses.gen.singular').dispatchCallback());
  }

  block(entityType: number, entityId: number, addressId: number, blockReasonCode: number): Observable<void> {
    return this.update(entityType, entityId, addressId, { isBlocked: 1, blockReasonCode });
  }

  unblock(entityType: number, entityId: number, addressId: number): Observable<void> {
    return this.update(entityType, entityId, addressId, { isBlocked: 0 });
  }

  delete(entityType: number, entityId: number, addressId: number): Observable<void> {
    return this.dataService
      .delete('/api/entityTypes/{entityType}/entities/{entityId}/addresses/{addressId}', { entityType, entityId, addressId })
      .catch(this.notificationsService.error('errors.default.delete').entity('entities.addresses.gen.singular').dispatchCallback());
  }
}
