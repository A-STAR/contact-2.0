import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CampaignService } from '../../campaign.service';

@Component({
  selector: 'app-call-center-documents',
  templateUrl: 'documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
  readonly debtExists$ = this.campaignService.campaignDebt$.map(Boolean);
  readonly debtId$ = this.campaignService.campaignDebt$.map(debt => debt.debtId);

  constructor(
    private campaignService: CampaignService,
  ) {}
}
