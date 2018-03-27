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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { IUserStatistic, ICampaign } from '../campaigns.interface';

import { CampaignsService } from '../campaigns.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { SimpleGridComponent } from '@app/shared/components/grids/grid/grid.component';
import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'full-size' },
  selector: 'app-statistics',
  styleUrls: ['./statistics.component.scss'],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @ViewChild(SimpleGridComponent) grid: SimpleGridComponent<IUserStatistic>;

  campaignUserStatistics: IUserStatistic[];

  columns: ISimpleGridColumn<IUserStatistic>[] = [
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
  ].map(addGridLabel('utilities.campaigns.statistics.grid'));

  private campaignStatisticSub: Subscription;
  private selectedCampaign: ICampaign;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.campaignsService.fetchCampaignStat(this.selectedCampaign.id)
        .pipe(first())
        .map(statistic => statistic && statistic.userStatistic)
        .subscribe((statistics: IUserStatistic[]) => {
          this.campaignUserStatistics = statistics;
          this.cdRef.markForCheck();
        }),
      enabled: combineLatest(
        this.userPermissionsService.has('CAMPAIGN_VIEW_STATISTICS'),
        this.campaignsService.selectedCampaign)
      .map(([hasRights, selected]) => hasRights && !!selected)
    }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private campaignsService: CampaignsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  ngOnInit(): void {
    this.campaignStatisticSub = combineLatest(
        this.canView$,
        this.campaignsService.selectedCampaign)
      .filter(([canView]) => {
        if (!canView) {
          this.campaignUserStatistics = [];
          this.cdRef.markForCheck();
        }
        return canView;
      })
      .map(([_, campaign]) => campaign)
      .flatMap(campaign => {
        if (!campaign) {
          return of(null);
        }
        this.selectedCampaign = campaign;
        return this.campaignsService.fetchCampaignStat(campaign.id);
      })
      .map(statistic => statistic && statistic.userStatistic)
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

  onSelect(): void {
    //
  }

}
