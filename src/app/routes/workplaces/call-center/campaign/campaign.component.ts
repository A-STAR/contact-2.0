import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { CampaignService } from './campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    CampaignService,
    ContactRegistrationService,
  ],
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
})
export class CampaignComponent implements OnInit {
  constructor(
    private campaignService: CampaignService,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    this.campaignService.preloadCampaignDebt();
  }

  get displayContactRegistration$(): Observable<boolean> {
    return this.contactRegistrationService.isActive$;
  }

  get hasDebt$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.pipe(map(Boolean));
  }
}
