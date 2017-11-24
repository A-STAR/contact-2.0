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

import { GridService } from '../../../../shared/components/grid/grid.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';

import {
  ICampaignsStatistic,
  IUserStatistic
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

  constructor(
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private campaignsService: CampaignsService,
  ) { }

  ngOnInit(): void {

    this.gridService.setAllRenderers(this.columns)
    .take(1)
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.campaignStatisticSub = this.campaignsService.selectedCampaign
      .flatMap(campaign => {
        if (!campaign) {
          return Observable.of(null);
        }
        return this.campaignsService.fetchCampaignStat(campaign.id);
      })
      // TODO uncomment when view will be ready
      // .do(data => data && data.agridatedData
      //   ? this.campaignArgigateStatistic = Observable.of(data.agridatedData)
      //   : this.campaignArgigateStatistic = Observable.of(null) )
      .map((statistic: ICampaignsStatistic) => statistic && statistic.userStatistic && statistic.userStatistic.length
        ? statistic.userStatistic
        : null)
      .subscribe((statistics: IUserStatistic[]) => {
        this.campaignUserStatistics = statistics;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.campaignStatisticSub) {
      this.campaignStatisticSub.unsubscribe();
    }
  }

  onSelect(data: any): void {

  }

}
