import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation,  ViewChild } from '@angular/core';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { Observable } from 'rxjs/Observable';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { ICampaignsStatistic, IUserStatistic } from '../campaigns.interface';


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

  columns: Array<IGridColumn> = [
    { prop: 'userFullName', minWidth: 250 },
    { prop: 'successProcessing', minWidth: 100 },
    { prop: 'unsuccessProcessing', minWidth: 100 },
    { prop: 'contact', minWidth: 100 },
    { prop: 'SMS', minWidth: 100 },
    { prop: 'successContact', minWidth: 100 },
    { prop: 'refusal', minWidth: 100 },
    { prop: 'SMS', minWidth: 100 },
    { prop: 'promise', minWidth: 100 },
    { prop: 'promiseAmount', minWidth: 100 },
  ];

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

      this.campaignStatistics = this.campaignsService.selectedCampaign
        .flatMap(campain => {
          console.log('seleted', campain);
          if (!campain) {
            return Observable.of(null);
          }
          return this.campaignsService.fetchCampaignStat(campain.id);
        })
        .map(data => data ? data.map( res => res.userStatistic) : null);
  }

  onSelect(): void {

  }
}
