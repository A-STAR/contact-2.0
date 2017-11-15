import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICampaignDebt } from '../campaign.interface';

import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-call-center-overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  constructor(
    private campaignService: CampaignService,
  ) {}

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this.campaignService.campaignDebt$;
  }
}
