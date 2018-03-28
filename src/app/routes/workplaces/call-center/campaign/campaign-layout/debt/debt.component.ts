import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { ICampaignDebt } from '../../campaign.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { IViewFormItem } from '@app/shared/components/form/view-form/view-form.interface';

import { CampaignService } from '../../campaign.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addFormLabel, range } from '@app/core/utils';
import { ITitlebar } from '@app/shared/components/titlebar/titlebar.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size '},
  selector: 'app-call-center-debt',
  templateUrl: 'debt.component.html',
})
export class DebtComponent implements OnInit {

  controls: IViewFormItem[];
  titlebar: ITitlebar = {
    title: 'modules.callCenter.overview.info.title',
  };

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

  private buildControls(attributes: IEntityAttributes): IViewFormItem[] {
    return [
      { controlName: 'debtId', type: 'text', width: 3 },
      { controlName: 'portfolioName', type: 'text', width: 3 },
      { controlName: 'bankName', type: 'text', width: 3 },
      { controlName: 'creditTypeCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE, width: 3 },
      { controlName: 'creditName', type: 'text', width: 3 },
      { controlName: 'contract', type: 'text', width: 3 },
      { controlName: 'creditStartDate', type: 'date', width: 3 },
      { controlName: 'creditEndDate', type: 'date', width: 3 },
      { controlName: 'regionCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_REGIONS, width: 3 },
      { controlName: 'branchCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_BRANCHES, width: 3 },
      { controlName: 'statusCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS, width: 3 },
      { controlName: 'debtAmount', type: 'text', width: 3 },
      { controlName: 'totalAmount', type: 'text', width: 3 },
      { controlName: 'currencyName', type: 'text', width: 3 },
      { controlName: 'dpd', type: 'text', width: 3 },
      { controlName: 'startDate', type: 'date', width: 3 },
      ...range(1, 4).map(i => ({
        type: 'dict',
        controlName: `dict${i}Code`,
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
        width: 3,
      })),
      {
        controlName: 'debtReasonCode',
        type: 'dict',
        dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
        width: 3,
      },
      { controlName: 'lastPromStatusCode', type: 'dict', dictCode: UserDictionariesService.DICTIONARY_PROMISE_STATUS, width: 3 },
      { controlName: 'lastPromDate', type: 'date', width: 3 },
      { controlName: 'lastPayDate', type: 'date', width: 3 },
      { controlName: 'lastCallDateTime', type: 'date', width: 3 },
      { controlName: 'lastVisitDateTime', type: 'date', width: 3 },
      { controlName: 'nextCallDateTime', type: 'date', width: 3 },
      { controlName: 'debtComment', type: 'text', width: 100 },
    ].map(addFormLabel('modules.callCenter.overview.debt'));
  }
}
