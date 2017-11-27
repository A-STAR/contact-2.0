import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CampaignService } from './campaign.service';

@Component({
  selector: 'app-campaign',
  templateUrl: 'campaign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CampaignService,
  ]
})
export class CampaignComponent implements OnInit {
  static COMPONENT_NAME = 'CampaignComponent';

  constructor(
    private campaignService: CampaignService,
  ) {}

  ngOnInit(): void {
    this.campaignService.preloadCampaignDebt();
  }

  get hasDebt$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.map(Boolean);
  }
}
