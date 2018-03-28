import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPledgorProperty } from './pledgor-property.interface';

import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

@Injectable()
export class PledgorPropertyService {
  static MESSAGE_PLEDGOR_PROPERTY_SELECTION_CHANGED = 'MESSAGE_PLEDGOR_PROPERTY_SELECTION_CHANGED';

  constructor(
    private propertyService: PropertyService,
  ) { }

  fetch(personId: number, propertyId: number): Observable<IPledgorProperty> {
    return this.propertyService.fetch(personId, propertyId)
      .map(this.propertyMapper);
  }

  fetchAll(personId: number): Observable<IPledgorProperty[]> {
    return this.propertyService.fetchAll(personId)
      .map(propertyList => propertyList.map(this.propertyMapper));
  }

  private propertyMapper = property => ({ ...property, propertyType: property.typeCode } as IPledgorProperty);
}
