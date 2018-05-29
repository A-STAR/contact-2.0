import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IGenesysCampaign } from './genesys.interface';

import { GenesysService } from '@app/routes/utilities/campaigns/genesys/genesys.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-genesys-campaigns',
  templateUrl: 'genesys.component.html'
})
export class GenesysCampaignsComponent {

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGenesysCampaign>;

  rows: IGenesysCampaign[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private genesysService: GenesysService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.genesysService
      .fetch(filters, params)
      .subscribe((response: IAGridResponse<IGenesysCampaign>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }
}
