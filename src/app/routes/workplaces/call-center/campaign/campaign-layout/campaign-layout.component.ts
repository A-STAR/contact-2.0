import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, mergeMap } from 'rxjs/operators';

import { CampaignService } from '../campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-campaign-layout',
  templateUrl: './campaign-layout.component.html',
})
export class CampaignLayoutComponent implements OnInit {
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
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    this.campaignService.preloadCampaignDebt();
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  shouldDisplayTab(tabIndex: number): boolean {
    return this.tabs[tabIndex].isInitialised;
  }

  toNextDebt(): void {
    this.contactRegistrationService.pauseRegistration().pipe(
      filter(status => status === null),
      mergeMap(() => this.campaignService.markCurrentDebtAsFinished()),
    )
    .subscribe(result => {
      if (result) {
        this.campaignService.preloadCampaignDebt();
        this.contactRegistrationService.cancelRegistration();
      } else {
        this.contactRegistrationService.continueRegistration();
      }
    });
  }
}
