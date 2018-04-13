import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddressByPerson, IAddressByContact } from '@app/shared/mass-ops/address/address.interface';
import { IGridActionPayload } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class AddressService {

  constructor(
    private actionGridService: ActionGridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) { }

  getCoordsByPerson(idData: IGridActionPayload): Observable<IAddressByPerson[]> {
    return this.dataService
      .create('/mass/persons/addressForMap', {},
        {
          idData: this.actionGridService.buildRequest(idData),
          // actionData: { personId }
        }
      )
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

  getCoordsByContacts(idData: IGridActionPayload): Observable<IAddressByContact[]> {
    return this.dataService
      .create('/mass/contact/addressForMap', {},
        {
          idData: this.actionGridService.buildRequest(idData),
          // actionData: { personId\ }
        }
      )
      .catch(this.notificationsService.fetchError().entity('entities.addresses.gen.plural').dispatchCallback());
  }

}
