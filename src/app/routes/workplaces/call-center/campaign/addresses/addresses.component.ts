import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-call-center-addresses',
  templateUrl: 'addresses.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent {
  constructor(
    private campaignService: CampaignService,
  ) {}

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.debtId);
  }

  get personId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.personId);
  }
}
