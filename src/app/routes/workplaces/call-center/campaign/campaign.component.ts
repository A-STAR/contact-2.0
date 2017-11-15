import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CampaignService } from './campaign.service';

@Component({
  selector: 'app-campaign',
  templateUrl: 'campaign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CampaignService,
  ]
})
export class CampaignComponent {
  static COMPONENT_NAME = 'CampaignComponent';
}
