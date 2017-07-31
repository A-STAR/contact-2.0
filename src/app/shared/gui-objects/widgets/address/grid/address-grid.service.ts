import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress, IAddressesResponse } from '../address.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class AddressGridService {
  constructor(private dataService: DataService) {}

  fetch(entityTypeId: number, personId: number): Observable<Array<IAddress>> {
    return this.dataService
      .read('/entityTypes/{entityTypeId}/entities/{personId}/addresses', { entityTypeId, personId })
      .map((response: IAddressesResponse) => response.addresses);
  }
}
