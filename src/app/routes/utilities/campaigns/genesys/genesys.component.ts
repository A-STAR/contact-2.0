import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CustomOperation } from '@app/shared/mass-ops/custom-operation/custom-operation.interface';
import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IGenesysCampaign } from './genesys.interface';
import { IGenesysStatisticsRecord } from '@app/routes/utilities/campaigns/genesys/statistics/statistics.interface';

import { CustomOperationService } from '@app/shared/mass-ops/custom-operation/custom-operation.service';
import { GenesysService } from '@app/routes/utilities/campaigns/genesys/genesys.service';
import { LayoutService } from '@app/core/layout/layout.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

import { isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-genesys-campaigns',
  templateUrl: 'genesys.component.html'
})
export class GenesysCampaignsComponent implements OnInit, OnDestroy {

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGenesysCampaign>;
  @ViewChild('campaigns', { read: TemplateRef }) campaigns: TemplateRef<any>;
  @ViewChild('statistics', { read: TemplateRef }) statistics: TemplateRef<any>;

  private routerSubscription: Subscription;
  // private selectedCampaign: IGenesysCampaign;
  private url: string;

  rows: IGenesysCampaign[] = [];
  rowCount = 0;

  statisticsRows: IGenesysStatisticsRecord[] = [];

  templates: Record<string, TemplateRef<any>>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private customOperationService: CustomOperationService,
    private genesysService: GenesysService,
    private layoutService: LayoutService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.templates = {
      campaigns: this.campaigns,
      statistics: this.statistics,
    };
    // TODO(d.maltsev): remove saving url and subscription if we get rid of route reuse
    this.url = this.router.url;
    this.updateCampaignStatus();
    this.routerSubscription = this.layoutService.navigationEnd$.subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === this.url) {
        this.updateCampaignStatus();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.genesysService
      .fetch(filters, params)
      .subscribe((response: IAGridResponse<IGenesysCampaign>) => {
        // Mock for easier setMode debugging
        // this.rows = response.data.map(item => ({ ...item, typeCode: 2, optBy: 1, optGoal: 50 }));
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.grid.deselectAll();
        // if (this.selectedCampaign) {
        //   if (response.data.find(campaign => campaign.id === this.selectedCampaign.id)) {
        //     this.fetchCampaignStatistics(this.selectedCampaign.id);
        //   } else {
        //     this.onSelectRow(null);
        //   }
        // }
        this.cdRef.markForCheck();
      });
  }

  onSelectRow(campaignIds: number[]): void {
    const campaign = isEmpty(campaignIds)
      ? null
      : this.rows.find(row => row.id === campaignIds[0]);
    // this.selectedCampaign = campaign;
    if (campaign) {
      this.fetchCampaignStatistics(campaign.id);
    } else {
      this.setCampaignStatistics(null);
    }
  }

  private updateCampaignStatus(): void {
    this.customOperationService
      .execute(CustomOperation.UPDATE_CAMPAIGN_STATUS, {} as any, {})
      .subscribe();
  }

  private fetchCampaignStatistics(campaignId: number): void {
    this.customOperationService
      .execute(CustomOperation.PBX_CAMPAIGN_STATISTICS, {} as any, { campaignId })
      .subscribe(
        response => this.setCampaignStatistics(response.data),
        () => this.setCampaignStatistics(null),
      );
  }

  private setCampaignStatistics(data: IGenesysStatisticsRecord[]): void {
    this.statisticsRows = data;
    this.cdRef.markForCheck();
  }
}
