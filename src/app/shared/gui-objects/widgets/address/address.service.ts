import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress } from './address.interface';
import { IAddressMarkData } from './grid/mark/mark.interface';

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

  fetchAll(entityType: number, entityId: number, forCallCenter: boolean): Observable<Array<IAddress>> {
    const url = this.getUrl(this.baseUrl, forCallCenter);
    return this.dataService
      .readAll(url, { entityType, entityId })
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.plural`).dispatchCallback());
  }

  fetch(entityType: number, entityId: number, addressId: number, forCallCenter: boolean): Observable<IAddress> {
    const url = this.getUrl(`${this.baseUrl}/{addressId}`, forCallCenter);
    return this.dataService
      .read(url, { entityType, entityId, addressId })
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  create(entityType: number, entityId: number, forCallCenter: boolean, address: IAddress): Observable<void> {
    const url = this.getUrl(this.baseUrl, forCallCenter);
    return this.dataService
      .create(url, { entityType, entityId }, address)
      .catch(this.notificationsService.createError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  update(
    entityType: number,
    entityId: number,
    addressId: number,
    forCallCenter: boolean,
    address: Partial<IAddress>
  ): Observable<void> {
    const url = this.getUrl(`${this.baseUrl}/{addressId}`, forCallCenter);
    return this.dataService
      .update(url, { entityType, entityId, addressId }, address)
      .catch(this.notificationsService.updateError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  block(
    entityType: number,
    entityId: number,
    addressId: number,
    forCallCenter: boolean,
    inactiveReasonCode: number
  ): Observable<void> {
    return this.update(entityType, entityId, addressId, forCallCenter, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, addressId: number, forCallCenter: boolean): Observable<void> {
    return this.update(entityType, entityId, addressId, forCallCenter, { isInactive: 0 });
  }

  delete(entityType: number, entityId: number, addressId: number, forCallCenter: boolean): Observable<void> {
    const url = this.getUrl(`${this.baseUrl}/{addressId}`, forCallCenter);
    return this.dataService
      .delete(url, { entityType, entityId, addressId })
      .catch(this.notificationsService.deleteError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  check(personId: number, addressId: number): Observable<boolean> {
    return this.dataService
      .read('/persons/{personId}/addresses/{addressId}/isWrongContactResults', { personId, addressId })
      .map(response => response.result)
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  markForVisit(personId: number, addressId: number, visit: IAddressMarkData): Observable<void> {
    return this.dataService
      .create('/persons/{personId}/addresses/{addressId}/visits', { personId, addressId }, visit)
      .catch(this.notificationsService.updateError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  private getUrl(url: string, forCallCenter: boolean): string {
    return forCallCenter ? `/callCenter${url}` : url;
  }
}
