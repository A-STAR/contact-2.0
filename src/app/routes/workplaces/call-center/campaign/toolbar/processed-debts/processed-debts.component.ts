import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ICampaignProcessedDebt } from '../../campaign.interface';
import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { CampaignService } from '../../campaign.service';
import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-call-center-toolbar-processed-debts',
  templateUrl: 'processed-debts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessedDebtsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  columns: IGridColumn[] = [
    { prop: 'personFullName', minWidth: 200 },
    { prop: 'debtId', minWidth: 50, maxWidth: 100 },
    { prop: 'contract' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'debtAmount', minWidth: 150 },
    { prop: 'currencyName', renderer: 'numberRenderer' },
    { prop: 'dpd', minWidth: 100 },
  ];
  debts: ICampaignProcessedDebt[];

  constructor(
    private campaignService: CampaignService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
        this.cdRef.markForCheck();
      });

    this.campaignService.fetchProcessedDebtsForCurrentCampaign()
      .subscribe(debts => {
        this.debts = debts;
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
