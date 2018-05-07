import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';
import { mapTo } from 'rxjs/operators/mapTo';
import { of } from 'rxjs/observable/of';

@Injectable()
export class PledgeCardService {
  readonly pledgor$ = new BehaviorSubject<any>(null);
  readonly property$ = new BehaviorSubject<any>(null);

  constructor(
    private personService: PersonService,
    private pledgeService: PledgeService,
    private propertyService: PropertyService,
  ) {}

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

  /**
   *  1. Создание персоны (если форма заполнена вручную, а не через поиск персоны)
   *     http://confluence.luxbase.int:8090/display/WEB20/Persons#Persons-POST/persons
   *  2. Создание имущества (если форма заполнена вручную, а не через поиск имущества)
   *     http://confluence.luxbase.int:8090/display/WEB20/Person+Property#PersonProperty-POST/persons/{personsId}/property
   *     - форма имущества
   *  3. Создание договора
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-POSTdebts/{debtsId}/pledgeContract
   *     - форма договора
   *     - ID залогодателя
   *     - ID имущества
   *     - стоимость имущества в договоре
   */
  createPledge(
    debtId: number,
    pledgorId: number,
    propertyId: number,
    contractFormData: any,
    pledgorFormData: any,
    propertyFormData: any,
  ): Observable<void> {
    const { pledgeValue, marketValue, currencyId } = propertyFormData;
    return combineLatest([
      this.savePledgor(pledgorId, pledgorFormData),
      this.saveProperty(pledgorId, propertyId, propertyFormData),
    ])
    .pipe(
      mergeMap(([ personId, createdPropertyId ]) => {
        const contract = {
          ...contractFormData,
          pledgors: [
            {
              personId,
              properties: [
                {
                  propertyId: createdPropertyId,
                  pledgeValue,
                  marketValue,
                  currencyId,
                },
              ],
            },
          ],
        };
        return this.pledgeService.create(debtId, contract);
      }),
    );
  }

  // tslint:disable:max-line-length
  /**
   *  1. Создание персоны (если форма заполнена вручную, а не через поиск персоны)
   *     http://confluence.luxbase.int:8090/display/WEB20/Persons#Persons-POST/persons
   *  2. Создание имущества (если форма заполнена вручную, а не через поиск имущества)
   *     http://confluence.luxbase.int:8090/display/WEB20/Person+Property#PersonProperty-POST/persons/{personsId}/property
   *     - форма имущества
   *  3. Создание связи с договором
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-POSTdebts/{debtsId}/pledgeContract/{pledgeContractId}/pledgor
   *     - ID залогодателя
   *     - ID имущества
   *     - стоимость имущества в договоре
   */
  // tslint:enable:max-line-length
  addPledgor(
    debtId: number,
    contractId: number,
    pledgorId: number,
    propertyId: number,
    pledgorFormData: any,
    propertyFormData: any,
  ): Observable<void> {
    const { pledgeValue, marketValue, currencyId } = propertyFormData;
    return combineLatest([
      this.savePledgor(pledgorId, pledgorFormData),
      this.saveProperty(pledgorId, propertyId, propertyFormData),
    ])
    .pipe(
      mergeMap(([ personId, createdPropertyId ]) => {
        const pledgor = {
          personId,
          properties: [
            {
              propertyId: createdPropertyId,
              pledgeValue,
              marketValue,
              currencyId,
            },
          ],
        };
        return this.pledgeService.addPledgor(debtId, contractId, pledgor);
      }),
    );
  }

  // tslint:disable:max-line-length
  /**
   *  1. Создание имущества (если форма заполнена вручную, а не через поиск имущества)
   *     http://confluence.luxbase.int:8090/display/WEB20/Person+Property#PersonProperty-POST/persons/{personsId}/property
   *     - форма имущества
   *  2. Создание связи с договором
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-POSTdebts/{debtsId}/pledgeContract/{pledgeContractId}/pledgor
   *     - ID залогодателя
   *     - ID имущества
   *     - стоимость имущества в договоре
   */
  // tslint:enable:max-line-length
  addProperty(
    debtId: number,
    contractId: number,
    pledgorId: number,
    propertyId: number,
    propertyFormData: any,
  ): Observable<void> {
    const { pledgeValue, marketValue, currencyId } = propertyFormData;
    return this.saveProperty(pledgorId, propertyId, propertyFormData).pipe(
      mergeMap((createdPropertyId) => {
        const pledgor = {
          personId: pledgorId,
          properties: [
            {
              propertyId: createdPropertyId,
              pledgeValue,
              marketValue,
              currencyId,
            },
          ],
        };
        return this.pledgeService.addPledgor(debtId, contractId, pledgor);
      }),
    );
  }

  // tslint:disable:max-line-length
  /**
   *  1. Изменение персоны (если форма dirty)
   *     http://confluence.luxbase.int:8090/display/WEB20/Persons#Persons-PUT/persons/{personsId}
   *  2. Изменение имущества (если форма dirty)
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-PUTdebts/{debtsId}/pledgeContract/{pledgeContractId}/pledgor/{pledgorId}/property/{propertyId}
   *     - форма имущества
   *     - стоимость имущества в договоре
   *  3. Изменение договора (если форма dirty)
   *     http://confluence.luxbase.int:8090/display/WEB20/Pledge+Contract#PledgeContract-PUTdebts/{debtsId}/pledgeContract/{pledgeContractId}
   *     - форма договора
   */
  // tslint:enable:max-line-length
  updatePledge(
    debtId: number,
    contractId: number,
    pledgorId: number,
    propertyId: number,
    contractFormData: any,
    pledgorFormData: any,
    propertyFormData: any,
  ): Observable<any> {
    return combineLatest([
      this.savePledgor(pledgorId, pledgorFormData),
      this.saveProperty(pledgorId, propertyId, propertyFormData),
      this.pledgeService.update(debtId, contractId, contractFormData),
    ]);
  }

  private savePledgor(pledgorId: number, pledgorFormData: any): Observable<number> {
    return this.pledgor$.pipe(
      mergeMap(pledgor => {
        if (pledgor) {
          return of(pledgor.id);
        } else {
          return pledgorId
            ? this.personService.update(pledgorId, pledgorFormData).pipe(mapTo(pledgorId))
            : this.personService.create(pledgorFormData);
        }
      }),
    );
  }

  private saveProperty(pledgorId: number, propertyId: number, propertyFormData: any): Observable<number> {
    return this.property$.pipe(
      mergeMap(property => {
        if (property) {
          return of(property.id);
        } else {
          return propertyId
            ? this.propertyService.update(pledgorId, propertyId, propertyFormData).pipe(mapTo(propertyId))
            : this.propertyService.create(pledgorId, propertyFormData);
        }
      }),
    );
  }
}
