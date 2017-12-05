import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-call-center-phones',
  templateUrl: 'phones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonesComponent {
  constructor(
    private campaignService: CampaignService,
  ) {}

  get campaignId(): number {
    return this.campaignService.campaignId;
  }

  get debtExists$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.map(Boolean);
  }

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.debtId);
  }

  get personId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.personId);
  }
}
