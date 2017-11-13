import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-campaign',
  templateUrl: 'campaign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignComponent {
  static COMPONENT_NAME = 'CallCenterComponent';
}
