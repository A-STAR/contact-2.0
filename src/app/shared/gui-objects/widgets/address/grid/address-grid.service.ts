import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress, IAddressesResponse } from '../address.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class AddressGridService {
  constructor(private dataService: DataService) {}

  fetch(personId: number): Observable<Array<IAddress>> {
    return this.dataService
      .read('/api/persons/{personId}/addresses', { personId })
      .map((response: IAddressesResponse) => response.addresses);
  }
}
