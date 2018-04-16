import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IAddressByPerson, IAddressByContact } from '@app/shared/mass-ops/address/address.interface';
import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
// import { DataService } from '@app/core/data/data.service';
// import { NotificationsService } from '@app/core/notifications/notifications.service';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AddressService {

  constructor(
    private actionGridService: ActionGridService,
    // private dataService: DataService,
    // private notificationsService: NotificationsService,
  ) {}

  getAddressesByPersons(idData: IGridActionPayload): Observable<IAddressByPerson[]> {
    // TODO(i.lobanov): remove mock when implemented on BE
    // to prevent linter complains
    let _idData = this.actionGridService.buildRequest(idData);
    _idData = _idData;
    return of([
        {
          id: 1,
          personId: 1,
          typeCode: 1,
          statusCode: 1,
          isInactive: 0,
          personFullName: 'Веничка Ерофеев',
          fullAddress: 'Россия, деревня Петушки',
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
          fullAddress: 'Греция, о. Итака',
          latitude: 38.416,
          longitude: 20.6739
        }
      ]
    );
    // return this.dataService
    //   .create('/mass/persons/addressForMap', {},
    //     {
    //       idData: this.actionGridService.buildRequest(idData),
    //     }
    //   )
    //   .map(response => ({ entityType: 'person', data: response }) as IAddressData<IAddressByPerson>)
    //   .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

  getAddressesByContacts(idData: IGridActionPayload): Observable<IAddressByContact[]> {
    // TODO(i.lobanov): remove mock when implemented on BE
    // to prevent linter complains
    let _idData = this.actionGridService.buildRequest(idData);
    _idData = _idData;
    return of([
        {
          id: 1,
          personId: 1,
          typeCode: 1,
          contactType: 1,
          debtId: 1,
          contract: 'Test',
          createDateTime: '',
          userId: 1,
          statusCode: 1,
          isInactive: 0,
          personFullName: 'Веничка Ерофеев',
          addressTypeCode: 1,
          fullAddress: 'Россия, деревня Петушки',
          contactLatitude: 55.9278,
          contactLongitude: 39.5216,
          distance: 100,
          comment: '',
          accuracy: 2
        },
        {
          id: 2,
          personId: 2,
          userId: 1,
          debtId: 2,
          contract: 'Test',
          contactType: 2,
          createDateTime: '',
          typeCode: 2,
          statusCode: 2,
          isInactive: 0,
          personFullName: 'Одиссей Лаэртович',
          addressTypeCode: 1,
          fullAddress: 'Греция, о. Итака',
          contactLatitude: 38.416,
          contactLongitude: 20.6739,
          distance: 100,
          comment: '',
          accuracy: 2
        }
      ] as any[]
    );
    // return this.dataService
    //   .create('/mass/contact/addressForMap', {},
    //     {
    //       idData: this.actionGridService.buildRequest(idData),
    //     }
    //   )
    //   .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

}
