import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress } from './address.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class AddressService {
  static MESSAGE_ADDRESS_SAVED = 'MESSAGE_ADDRESS_SAVED';

  private baseUrl = '/entityTypes/{entityType}/entities/{entityId}/addresses';
  private entity = 'entities.addresses.gen';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IAddress>> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId })
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.plural`).dispatchCallback());
  }

  fetch(entityType: number, entityId: number, addressId: number): Observable<IAddress> {
    return this.dataService
      .read(`${this.baseUrl}/{addressId}`, { entityType, entityId, addressId })
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  create(entityType: number, entityId: number, address: IAddress): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, address)
      .catch(this.notificationsService.createError().entity(`${this.entity}.singular`).dispatchCallback()
      );
  }

  update(entityType: number, entityId: number, addressId: number, address: Partial<IAddress>): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{addressId}`, { entityType, entityId, addressId }, address)
      .catch(this.notificationsService.updateError().entity(`${this.entity}.singular`).dispatchCallback()
      );
  }

  block(entityType: number, entityId: number, addressId: number, inactiveReasonCode: number): Observable<void> {
    return this.update(entityType, entityId, addressId, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, addressId: number): Observable<void> {
    return this.update(entityType, entityId, addressId, { isInactive: 0 });
  }

  delete(entityType: number, entityId: number, addressId: number): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{addressId}`, { entityType, entityId, addressId })
      .catch(this.notificationsService.deleteError().entity(`${this.entity}.singular`).dispatchCallback()
      );
  }

  check(personId: number, addressId: number): Observable<boolean> {
    return this.dataService
      .read('/persons/{personId}/addresses/{addressId}/isWrongContactResults', { personId, addressId })
      .map(response => response.result)
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.singular`).dispatchCallback());
  }
}
