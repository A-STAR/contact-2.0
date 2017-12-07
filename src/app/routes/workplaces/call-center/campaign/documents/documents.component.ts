import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CampaignService } from '../campaign.service';

@Component({
  selector: 'app-call-center-documents',
  templateUrl: 'documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent {
  constructor(
    private campaignService: CampaignService,
  ) {}

  get debtExists$(): Observable<boolean> {
    return this.campaignService.campaignDebt$.map(Boolean);
  }

  get debtId$(): Observable<number> {
    return this.campaignService.campaignDebt$.map(debt => debt.debtId);
  }
}
