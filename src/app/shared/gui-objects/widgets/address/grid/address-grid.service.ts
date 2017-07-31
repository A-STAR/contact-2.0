import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAddress, IAddressesResponse } from '../address.interface';

import { DataService } from '../../../../../core/data/data.service';

@Injectable()
export class AddressGridService {
  constructor(private dataService: DataService) {}

  fetch(personId: number): Observable<Array<IAddress>> {
    // return this.dataService
    //   .read('/api/persons/{personId}/addresses', { personId })
    //   .map((response: IAddressesResponse) => response.addresses);

    return Observable.of([
      {
        id: 1,
        typeCode: 1,
        postalCode: '123456',
        statusCode: 1,
        isBlocked: false,
        blockReasonCode: null,
        blockDateTime: null,
        fullAddress: '',
        country: 'Russia',
        region: '',
        area: '',
        city: '',
        settlement: '',
        cityDistrict: '',
        street: '',
        house: '',
        building: '',
        flat: '105',
        isText: false,
        isResidence: true,
        comment: 'Comment',
      }
    ]);
  }
}
