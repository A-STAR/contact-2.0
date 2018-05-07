import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

import { IAddressByPerson, IAddressByContact } from '@app/shared/mass-ops/address/address.interface';
import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';
import { IResponse } from '@app/core/data/data.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class AddressService {

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  getAddressesByPersons(idData: IGridActionPayload): Observable<IAddressByPerson[]> {
    return this.dataService
      .create('/sync/mass/persons/addressForMap', {},
        {
          idData: this.actionGridService.buildRequest(idData),
        }
      )
      .pipe(
        map<IResponse<IAddressByPerson[]>, IAddressByPerson[]>(response => response.data)
      )
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

  getAddressesByContacts(idData: IGridActionPayload): Observable<IAddressByContact[]> {
    return this.dataService
      .create('/sync/mass/contact/addressForMap', {},
        {
          idData: this.actionGridService.buildRequest(idData),
        }
      )
      .pipe(
        map<IResponse<IAddressByContact[]>, IAddressByContact[]>(response => response.data)
      )
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

}
