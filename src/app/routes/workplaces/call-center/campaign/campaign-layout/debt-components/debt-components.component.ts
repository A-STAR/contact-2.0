import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CampaignService } from '../../campaign.service';

@Component({
  selector: 'app-call-center-debt-components',
  templateUrl: 'debt-components.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtComponentsComponent {
  constructor(
    private campaignService: CampaignService,
  ) {}

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.debtId);
  }
}
