import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { CampaignService } from './campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  providers: [
    CampaignService,
    ContactRegistrationService,
  ],
  selector: 'app-campaign',
  templateUrl: 'campaign.component.html',
})
export class CampaignComponent implements OnInit {
  tabs = [
    { isInitialised: true },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
    { isInitialised: false },
  ];

  constructor(
    private campaignService: CampaignService,
  ) {}

  ngOnInit(): void {
    this.campaignService.preloadCampaignDebt();
  }

  get hasDebt$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.pipe(map(Boolean));
  }

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.pipe(map(debt => debt.debtId));
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  shouldDisplayTab(tabIndex: number): boolean {
    return this.tabs[tabIndex].isInitialised;
  }
}
