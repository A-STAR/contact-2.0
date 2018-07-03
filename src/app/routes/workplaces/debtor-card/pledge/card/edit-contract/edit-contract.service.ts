import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { PersonService } from '@app/routes/workplaces/core/person/person.service';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Injectable()
export class PledgeCardEditContractService {

  constructor(
    private pledgeService: PledgeService,
    private personService: PersonService,
  ) {}

  saveContract(
    debtId: number,
    contractId: number,
    pledgorId: number,
    propertyId: number,
    contract: any,
    pledgor: any,
    property: any,
    propertyValue: any,
  ): Observable<any> {
    return combineLatest(
      this.personService.update(pledgorId, pledgor),
      this.pledgeService.updateProperty(debtId, contractId, pledgorId, propertyId, property, propertyValue),
      this.pledgeService.update(debtId, contractId, contract),
    );
  }
}
