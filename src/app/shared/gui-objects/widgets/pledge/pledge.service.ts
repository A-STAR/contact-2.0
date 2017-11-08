import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPledgeContract, IPledgeContractCreation } from './pledge.interface';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class PledgeService {
  static MESSAGE_PLEDGE_CONTRACT_SAVED = 'MESSAGE_PLEDGE_CONTRACT_SAVED';

  private baseUrl = '/debts/{debtId}/pledgeContract';
  private errSingular = 'entities.pledgeContract.gen.singular';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('PLEDGE_ADD');
  }

  fetchAll(debtId: number): Observable<Array<IPledgeContract>> {
    return this.dataService.readAll(this.baseUrl, { debtId })
      .catch(this.notificationsService.fetchError().entity('entities.pledgeContract.gen.plural').dispatchCallback());
  }

  createPledgeContractCreation(contract: IPledgeContract): IPledgeContractCreation {
    return {
      contractNumber: contract.contractNumber,
      contractStartDate: contract.contractStartDate,
      contractEndDate: contract.contractEndDate,
      comment: contract.comment,
      pledgors: [{
        personId: contract.personId,
        properties: [{
          propertyId: contract.propertyId,
          pledgeValue: contract.pledgeValue,
          marketValue: contract.marketValue,
          currencyId: contract.currencyId
        }]
      }]
    };
  }

  create(debtId: number, contract: IPledgeContractCreation): Observable<any> {
    return this.dataService
      .create(this.baseUrl, { debtId }, contract)
      .catch(this.notificationsService.createError().entity(this.errSingular).dispatchCallback());
  }
}
