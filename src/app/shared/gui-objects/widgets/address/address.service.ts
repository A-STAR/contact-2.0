import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress, IAddressesResponse } from './address.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class AddressService {
  constructor(private dataService: DataService) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IAddress>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/addresses', { entityType, entityId })
      .map((response: IAddressesResponse) => response.addresses);
  }

  fetch(entityType: number, entityId: number, addressId: number): Observable<IAddress> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/addresses/{addressId}', { entityType, entityId, addressId })
      .map((response: IAddressesResponse) => response.addresses[0]);
  }

  create(entityType: number, entityId: number, address: IAddress): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/addresses/', { entityType, entityId }, address);
  }

  update(entityType: number, entityId: number, addressId: number, address: Partial<IAddress>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/addresses/{addressId}', { entityType, entityId, addressId }, address);
  }

  block(entityType: number, entityId: number, addressId: number): Observable<void> {
    return this.update(entityType, entityId, addressId, { isBlocked: true });
  }

  unblock(entityType: number, entityId: number, addressId: number): Observable<void> {
    return this.update(entityType, entityId, addressId, { isBlocked: false });
  }
}
