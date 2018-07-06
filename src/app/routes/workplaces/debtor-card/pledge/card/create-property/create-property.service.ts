import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { first, mergeMap } from 'rxjs/operators';

import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

@Injectable()
export class PledgeCardCreatePropertyService {

  readonly property$ = new BehaviorSubject<any>(null);

  constructor(
    private pledgeService: PledgeService,
    private propertyService: PropertyService,
  ) {}

  selectProperty(property: any): void {
    const nextProperty = property
      ? {
          id: property.id,
          propertyName: property.name,
          propertyType: property.typeCode || property.type,
        }
      : null;
    this.property$.next(nextProperty);
  }

  createProperty(debtId: number, contractId: number, pledgorId: number, property: any, propertyValue: any): Observable<any> {
    return this.saveProperty(pledgorId, property)
      .pipe(
        mergeMap(propertyId => {
          return this.pledgeService.addPledgor(debtId, contractId, pledgorId, propertyId, propertyValue);
        }),
      );
  }

  private saveProperty(pledgorId: number, propertyData: any): Observable<number> {
    const payload = {
      typeCode: propertyData.propertyType,
    };
    return this.property$.pipe(
      mergeMap(property => {
        return property
          ? of(property.id)
          : this.propertyService.create(pledgorId, payload);
      }),
      first(),
    );
  }
}
