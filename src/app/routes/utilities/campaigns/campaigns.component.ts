import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent {

}
