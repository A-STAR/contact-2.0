import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPledgerProperty } from './pledger-property.interface';

import { PropertyService } from '../../../../shared/gui-objects/widgets/property/property.service';

@Injectable()
export class PledgerPropertyService {
  static MESSAGE_PLEDGER_PROPERTY_SELECTION_CHANGED = 'MESSAGE_PLEDGER_PROPERTY_SELECTION_CHANGED';

  constructor(
    private propertyService: PropertyService,
  ) { }

  fetchAll(personId: number): Observable<IPledgerProperty[]> {
    return this.propertyService.fetchAll(personId)
      .map(propertyList => propertyList.map(
        property => ({ ...property, propertyType: property.typeCode } as IPledgerProperty)
      ));
  }
}
