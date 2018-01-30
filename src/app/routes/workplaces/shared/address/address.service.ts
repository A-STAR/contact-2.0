import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IAddress } from './address.interface';
import { IAddressMarkData } from './grid/mark/mark.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class AddressService extends AbstractActionService {
  static MESSAGE_ADDRESS_SAVED = 'MESSAGE_ADDRESS_SAVED';

  private baseUrl = '/entityTypes/{entityType}/entities/{entityId}/addresses';
  private entity = 'entities.addresses.gen';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(entityType: number, entityId: number, callCenter: boolean): Observable<Array<IAddress>> {
    return this.dataService
      .readAll(this.baseUrl, { entityType, entityId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.plural`).dispatchCallback());
  }

  fetch(entityType: number, entityId: number, addressId: number, callCenter: boolean): Observable<IAddress> {
    return this.dataService
      .read(`${this.baseUrl}/{addressId}`, { entityType, entityId, addressId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  create(entityType: number, entityId: number, callCenter: boolean, address: IAddress): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, address, { params: { callCenter } })
      .catch(this.notificationsService.createError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  update(
    entityType: number,
    entityId: number,
    addressId: number,
    callCenter: boolean,
    address: Partial<IAddress>
  ): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{addressId}`, { entityType, entityId, addressId }, address, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  block(
    entityType: number,
    entityId: number,
    addressId: number,
    callCenter: boolean,
    inactiveReasonCode: number
  ): Observable<void> {
    return this.update(entityType, entityId, addressId, callCenter, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, addressId: number, callCenter: boolean): Observable<void> {
    return this.update(entityType, entityId, addressId, callCenter, { isInactive: 0 });
  }

  delete(entityType: number, entityId: number, addressId: number, callCenter: boolean): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{addressId}`, { entityType, entityId, addressId }, { params: { callCenter } })
      .catch(this.notificationsService.deleteError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  check(personId: number, addressId: number): Observable<boolean> {
    return this.dataService
      .read('/persons/{personId}/addresses/{addressId}/isWrongContactResults', { personId, addressId })
      .map(response => response.result)
      .catch(this.notificationsService.fetchError().entity(`${this.entity}.singular`).dispatchCallback());
  }

  markForVisit(personId: number, addressId: number, visit: IAddressMarkData, callCenter: boolean): Observable<void> {
    return this.dataService
      .create('/persons/{personId}/addresses/{addressId}/visits', { personId, addressId }, visit, { params: { callCenter } })
      .catch(this.notificationsService.updateError().entity(`${this.entity}.singular`).dispatchCallback());
  }
}
