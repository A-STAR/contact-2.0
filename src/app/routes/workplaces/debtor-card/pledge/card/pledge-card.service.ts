import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PledgeCardService {
  readonly pledgor$ = new BehaviorSubject<any>(null);
  readonly property$ = new BehaviorSubject<any>(null);

  selectPledgor(pledgor: any): void {
    this.pledgor$.next(pledgor);
  }

  selectProperty(property: any): void {
    const nextProperty = property
      ? {
          propertyName: property.name,
          propertyType: property.typeCode || property.type,
        }
      : null;
    this.property$.next(nextProperty);
  }
}
