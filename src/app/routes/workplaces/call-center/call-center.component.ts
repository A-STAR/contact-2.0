import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICampaign } from './call-center.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { CallCenterService } from './call-center.service';

import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    CallCenterService,
  ],
  selector: 'app-call-center',
  templateUrl: 'call-center.component.html',
})
export class CallCenterComponent {
  columns: ISimpleGridColumn<ICampaign>[] = [
    { prop: 'name' },
    { prop: 'comment' },
  ].map(addGridLabel('modules.callCenter.grid'));

  selectedCampaign: ICampaign;

  constructor(
    private callCenterService: CallCenterService,
    private cdRef: ChangeDetectorRef,
  ) {}

  get campaigns$(): Observable<ICampaign[]> {
    return this.callCenterService.campaigns$;
  }

  onAction(campaign: ICampaign): void {
    this.callCenterService.navigateToCampaign(campaign);
  }

  onSelect(campaigns: ICampaign[]): void {
    const campaign = isEmpty(campaigns)
      ? null
      : campaigns[0];
    this.selectedCampaign = campaign;
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    if (this.selectedCampaign) {
      // TODO(d.maltsev): check using resolver if the campaign is active before redirecting
      this.callCenterService.navigateToCampaign(this.selectedCampaign);
    }
  }
}
