import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';

import { ICampaignProcessedDebt } from '../../campaign.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { CampaignService } from '../../campaign.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { NumberRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-call-center-toolbar-processed-debts',
  templateUrl: 'processed-debts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessedDebtsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  columns: ISimpleGridColumn<ICampaignProcessedDebt>[] = [
    { prop: 'personFullName', minWidth: 200 },
    { prop: 'debtId', minWidth: 50, maxWidth: 100 },
    { prop: 'contract' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS },
    { prop: 'debtAmount', minWidth: 150 },
    { prop: 'currencyName', renderer: NumberRendererComponent },
    { prop: 'dpd', minWidth: 100 },
  ].map(addGridLabel('modules.callCenter.processedDebts.grid'));

  debts: ICampaignProcessedDebt[];

  constructor(
    private campaignService: CampaignService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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
