import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';

import { ICampaignDebt } from '../campaign.interface';

import { CampaignService } from '../campaign.service';
import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { addViewFormLabel, range } from '../../../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-call-center-debt',
  templateUrl: 'debt.component.html'
})
export class DebtComponent implements OnInit {
  controls;

  constructor(
    private campaignService: CampaignService,
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
  ) {}

  ngOnInit(): void {
    this.entityAttributesService.getDictValueAttributes()
      .pipe(first())
      .subscribe(attributes => {
        this.controls = this.buildControls(attributes);
        this.cdRef.markForCheck();
      });
  }

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this.campaignService.campaignDebt$;
  }

  private buildControls(attributes: any): any[] {
    return [
      { name: 'debtId', type: 'text', width: 25 },
      { name: 'portfolioName', type: 'text', width: 25 },
      { name: 'bankName', type: 'text', width: 25 },
      { name: 'creditTypeCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE, width: 25 },
      { name: 'creditName', type: 'text', width: 25 },
      { name: 'contract', type: 'text', width: 25 },
      { name: 'creditStartDate', type: 'date', width: 25 },
      { name: 'creditEndDate', type: 'date', width: 25 },
      { name: 'regionCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_REGIONS, width: 25 },
      { name: 'branchCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_BRANCHES, width: 25 },
      { name: 'statusCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS, width: 25 },
      { name: 'debtAmount', type: 'text', width: 25 },
      { name: 'totalAmount', type: 'text', width: 25 },
      { name: 'currencyName', type: 'text', width: 25 },
      { name: 'dpd', type: 'text', width: 25 },
      { name: 'startDate', type: 'date', width: 25 },
      ...range(1, 4).map(i => ({
        name: `dict${i}Code`,
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
        width: 25,
      })),
      { name: 'debtReasonCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON, width: 25 },
      { name: 'lastPromStatusCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_PROMISE_STATUS, width: 25 },
      { name: 'lastPromDate', type: 'date', width: 25 },
      { name: 'lastPayDate', type: 'date', width: 25 },
      { name: 'lastCallDateTime', type: 'date', width: 25 },
      { name: 'lastVisitDateTime', type: 'date', width: 25 },
      { name: 'nextCallDateTime', type: 'date', width: 25 },
      { name: 'debtComment', type: 'text', width: 100 },
    ].map(addViewFormLabel('modules.callCenter.overview.debt'));
  }
}
