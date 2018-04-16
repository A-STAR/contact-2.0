import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddressByPerson, IAddressByContact, IAddressData } from '@app/shared/mass-ops/address/address.interface';
import { IGridActionPayload, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AddressService {

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) { }

  getAddresses(action: IGridAction): Observable<IAddressData<IAddressByPerson | IAddressByContact>> {
    return this.actionGridService.hasParamKey('personId', action) ?
      this.getAddressesByPersons(action.payload) : this.getAddressesByPersons(action.payload);
  }

  getAddressesByPersons(idData: IGridActionPayload): Observable<IAddressData<IAddressByPerson>> {
    // TODO(i.lobanov): remove mock when implemented on BE
    // to prevent linter complains
    let _idData = this.actionGridService.buildRequest(idData);
    _idData = _idData;
    return of({
      entityType: 'person' as any,
      data: [
        {
          id: 1,
          personId: 1,
          typeCode: 1,
          statusCode: 1,
          isInactive: 0,
          personFullName: 'Веничка Ерофеев',
          fullAddress: 'деревня Петушки',
          latitude: 55.9278,
          longitude: 39.5216
        },
        {
          id: 2,
          personId: 2,
          typeCode: 2,
          statusCode: 2,
          isInactive: 0,
          personFullName: 'Одиссей Лаэртович',
          fullAddress: 'Итака',
          latitude: 38.416,
          longitude: 20.6739
        }
      ],
    });
    // return this.dataService
    //   .create('/mass/persons/addressForMap', {},
    //     {
    //       idData: this.actionGridService.buildRequest(idData),
    //     }
    //   )
    //   .map(response => ({ entityType: 'person', data: response }) as IAddressData<IAddressByPerson>)
    //   .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

  getAddressesByContacts(idData: IGridActionPayload): Observable<IAddressData<IAddressByContact>> {
    return this.dataService
      .create('/mass/contact/addressForMap', {},
        {
          idData: this.actionGridService.buildRequest(idData),
        }
      )
      .map(response => ({ entityType: 'contact', data: response }) as IAddressData<IAddressByContact>)
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

}
