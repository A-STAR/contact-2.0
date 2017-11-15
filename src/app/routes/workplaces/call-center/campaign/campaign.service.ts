import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ICampaignDebt } from './campaign.interface';

// import { DataService } from '../../../../core/data/data.service';
// import { NotificationsService } from '../../../../core/notifications/notifications.service';

interface ICampaignRouteParams {
  campaignId: number;
}

@Injectable()
export class CampaignService {
  constructor(
    // private dataService: DataService,
    // private notificationsService: NotificationsService,
    private route: ActivatedRoute,
  ) {
    this.fetchDebtId(this.campaignId)
      .flatMap(debtId => this.fetchCampaignDebt(this.campaignId, debtId))
      .subscribe(console.log);
  }

  get campaignId(): number {
    return this.routeParams.campaignId;
  }

  get routeParams(): ICampaignRouteParams {
    return (this.route.params as BehaviorSubject<ICampaignRouteParams>).value;
  }

  private fetchDebtId(campaignId: number): Observable<number> {
    return Observable.of(1);

    // TODO(d.maltsev): uncomment when API is ready
    // return this.dataService.read('/campaigns/{campaignId}/debts', { campaignId })
    //   .map(response => response.debtId)
    //   .catch(this.notificationsService.fetchError().entity('entities.debt.gen.singular').dispatchCallback());
  }

  private fetchCampaignDebt(campaignId: number, debtId: number): Observable<ICampaignDebt> {
    return Observable.of({
      bankName: 'Bank of America',
      birthDate: '1980-01-01',
      branchCode: 1,
      contract: 'Contract #12345AB',
      creditEndDate: '2017-01-01',
      creditName: 'Mortgage',
      creditStartDate: '2007-01-01',
      creditTypeCode: 1,
      currencyName: 'RUB',
      debtAmount: 5000000,
      debtId: 1,
      debtComment: 'I am a debt comment.',
      debtReasonCode: 1,
      dict1Code: 1,
      dict2Code: 1,
      dict3Code: 1,
      dict4Code: 1,
      docNumber: 'Document #ABCD-1234',
      dpd: 10,
      lastCallDateTime: null,
      lastPayDate: null,
      lastPromDate: null,
      lastPromStatusCode: null,
      lastVisitDateTime: null,
      nextCallDateTime: null,
      personComment: 'I am a person comment.',
      personFirstName: 'John',
      personLastName: 'Smith',
      personMiddleName: 'Norman',
      portfolioName: 'Portfolio Name',
      regionCode: 1,
      shortInfo: 'I am short info!',
      startDate: '2007-01-01',
      statusCode: 1,
      totalAmount: 1,
    });

    // TODO(d.maltsev): uncomment when API is ready
    // return this.dataService.read('/campaigns/{campaignId}/debts/{debtId}', { campaignId, debtId })
    //   .catch(this.notificationsService.fetchError().entity('entities.debt.gen.singular').dispatchCallback());
  }
}
