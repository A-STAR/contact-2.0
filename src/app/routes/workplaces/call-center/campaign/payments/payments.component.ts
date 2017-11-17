import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-call-center-payments',
  templateUrl: 'payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsComponent {
  constructor(
    private campaignService: CampaignService,
  ) {}

  get debtExists$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.map(Boolean);
  }

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt && debt.debtId);
  }
}
