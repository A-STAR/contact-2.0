import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress, IAddressesResponse } from '../address.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class AddressGridService {
  constructor(private dataService: DataService) {}

  fetch(entityType: number, entityId: number): Observable<Array<IAddress>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/addresses', { entityType, entityId })
      .map((response: IAddressesResponse) => response.addresses);
  }
}
