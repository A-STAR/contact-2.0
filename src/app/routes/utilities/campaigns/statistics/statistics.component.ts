import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,  ViewChild } from '@angular/core';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { Observable } from 'rxjs/Observable';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { ICampaignsStatistic, IUserStatistic, ICampainAgrigatedStatistic } from '../campaigns.interface';


import { CampaignsService } from '../campaigns.service';
import { GridService } from '../../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements OnInit {

  @ViewChild(GridComponent) grid: GridComponent;

  campaignStatistics: Observable<IUserStatistic[]>;
  campaignArgigateStatistic: Observable<ICampainAgrigatedStatistic>;

  _columns: Array<IGridColumn> = [
    { prop: 'userFullName', minWidth: 250 },
    { prop: 'successProcessing', minWidth: 100 },
    { prop: 'unsuccessProcessing', minWidth: 100 },
    { prop: 'contact', minWidth: 100 },
    { prop: 'SMS', minWidth: 100, renderer: 'phoneRenderer'},
    { prop: 'successContact', minWidth: 100 },
    { prop: 'refusal', minWidth: 100 },
    { prop: 'promise', minWidth: 100 },
    { prop: 'promiseAmount', minWidth: 100 },
  ];

  columns: IGridColumn[] = [];

  constructor(
    private gridService: GridService,
    private cdRef: ChangeDetectorRef,
    private campaignsService: CampaignsService,
  ) { }

  ngOnInit(): void {

      this.columns = this.gridService.setRenderers(this._columns);

      this.campaignStatistics = this.campaignsService.selectedCampaign
        .flatMap(campain => {
          if (!campain) {
            return Observable.of(null);
          }
          return this.campaignsService.fetchCampaignStat(campain.id);
        })
        // TODO uncomment when view will be ready
        // .do(data => data && data.agridatedData
        //   ? this.campaignArgigateStatistic = Observable.of(data.agridatedData)
        //   : this.campaignArgigateStatistic = Observable.of(null) )
        .map(data => data && data.userStatistic && data.userStatistic.length
          ? data.userStatistic
          : null);
  }

  onSelect(): void {

  }
}
