import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { first, mergeMap } from 'rxjs/operators';

import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

@Injectable()
export class PledgeCardCreatePledgorService {

  readonly pledgor$ = new BehaviorSubject<any>(null);
  readonly property$ = new BehaviorSubject<any>(null);

  constructor(
    private pledgeService: PledgeService,
    private personService: PersonService,
    private propertyService: PropertyService,
  ) {}

  selectPledgor(pledgor: any): void {
    this.pledgor$.next(pledgor);
  }

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

  createPledgor(debtId: number, contractId: number, pledgor: any, property: any, propertyValue: any): Observable<any> {
    return this.savePledgor(pledgor)
      .pipe(
        mergeMap(pledgorId => {
          return this.saveProperty(pledgorId, property)
            .pipe(
              mergeMap(propertyId => {
                return this.pledgeService.addPledgor(debtId, contractId, pledgorId, propertyId, propertyValue);
              }),
            );
        }),
      );
  }

  private savePledgor(pledgorData: any): Observable<number> {
    return this.pledgor$.pipe(
      mergeMap(pledgor => {
        return pledgor
          ? of(pledgor.id)
          : this.personService.create(pledgorData);
      }),
      first(),
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
