import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';


import {
  ICampaignsStatistic,
  IUserStatistic,
  ICampaign,
} from '../campaigns.interface';
import { CampaignsService } from '../campaigns.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements OnInit, OnDestroy {

  @ViewChild(GridComponent) grid: GridComponent;

  campaignUserStatistics: IUserStatistic[];

  columns: Array<IGridColumn> = [
    { prop: 'userFullName', minWidth: 200 },
    { prop: 'successProcessing', minWidth: 250 },
    { prop: 'unsuccessProcessing', minWidth: 250 },
    { prop: 'contact', minWidth: 200 },
    { prop: 'SMS', minWidth: 200 },
    { prop: 'successContact', minWidth: 200 },
    { prop: 'refusal', minWidth: 200 },
    { prop: 'promise', minWidth: 200 },
    { prop: 'promiseAmount', minWidth: 200 },
    // todo: move it to aggregated statistics
    // { prop: 'untreated', minWidth: 200 },
    // { prop: 'successProcessingSum', minWidth: 200 },
    // { prop: 'unsuccessProcessingSum', minWidth: 200 },
    // { prop: 'contactSum', minWidth: 200 },
    // { prop: 'SMSSum', minWidth: 200 },
    // { prop: 'refusalSum', minWidth: 200 },
    // { prop: 'promiseSum', minWidth: 200 },
    // { prop: 'promiseAmountSum', minWidth: 200 },
  ];

  private campaignStatisticSub: Subscription;
  private selectedCampaign: ICampaign;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.campaignsService.fetchCampaignStat(this.selectedCampaign.id)
        .take(1)
        .map((statistic: ICampaignsStatistic) => statistic && statistic.userStatistic)
        .subscribe((statistics: IUserStatistic[]) => {
          this.campaignUserStatistics = statistics;
          this.cdRef.markForCheck();
        }),
      enabled: Observable.combineLatest(this.userPermissionsService.has('CAMPAIGN_VIEW_STATISTICS'),
        this.campaignsService.selectedCampaign).map(([hasRights, selected]) => hasRights && !!selected)
    }
  ];


  constructor(
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private campaignsService: CampaignsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {

    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.campaignStatisticSub = Observable
      .combineLatest(
        this.canView$,
        this.campaignsService.selectedCampaign)
      .filter(([canView, campaign]) => {
        if (!canView) {
          this.campaignUserStatistics = [];
          this.cdRef.markForCheck();
        }
        return canView;
      })
      .map(([canView, campaign]) => campaign)
      .flatMap(campaign => {
        if (!campaign) {
          return Observable.of(null);
        }
        this.selectedCampaign = campaign;
        return this.campaignsService.fetchCampaignStat(campaign.id);
      })
      .map((statistic: ICampaignsStatistic) => statistic && statistic.userStatistic)
      .subscribe((statistics: IUserStatistic[]) => {
        this.campaignUserStatistics = statistics;
        this.cdRef.markForCheck();
      });
  }

  private get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CAMPAIGN_VIEW_STATISTICS');
  }

  ngOnDestroy(): void {
    if (this.campaignStatisticSub) {
      this.campaignStatisticSub.unsubscribe();
    }
  }

  onSelect(data: any): void {

  }

}
