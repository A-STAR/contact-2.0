import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICampaignDebt } from '../campaign.interface';
import { IDynamicFormGroup } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { CampaignService } from '../campaign.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.callCenter.campaign.overview');

@Component({
  selector: 'app-call-center-overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {
  controls: IDynamicFormGroup[] = [
    {
      collapsible: true,
      title: labelKey('info.title'),
      children: [
        { label: labelKey('info.shortInfo'), controlName: 'shortInfo', type: 'textarea', disabled: true },
      ]
    },
    {
      collapsible: true,
      title: labelKey('debtor.title'),
      children: [
        { label: labelKey('debtor.fullName'), controlName: 'fullName', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debtor.birthDate'), controlName: 'birthDate', type: 'datepicker', disabled: true, width: 6 },
        { label: labelKey('debtor.docNumber'), controlName: 'docNumber', type: 'text', disabled: true },
        { label: labelKey('debtor.personComment'), controlName: 'personComment', type: 'textarea', disabled: true },
      ],
    },
    {
      collapsible: true,
      title: labelKey('debt.title'),
      children: [
        { label: labelKey('debt.debtId'), controlName: 'debtId', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.portfolioName'), controlName: 'portfolioName', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.bankName'), controlName: 'bankName', type: 'text', disabled: true, width: 6 },
        {
          label: labelKey('debt.creditTypeCode'),
          controlName: 'creditTypeCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
          disabled: true,
          width: 6,
        },
        { label: labelKey('debt.creditName'), controlName: 'creditName', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.contract'), controlName: 'contract', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.creditStartDate'), controlName: 'creditStartDate', type: 'datepicker', disabled: true, width: 6 },
        { label: labelKey('debt.creditEndDate'), controlName: 'creditEndDate', type: 'datepicker', disabled: true, width: 6 },
        {
          label: labelKey('debt.regionCode'),
          controlName: 'regionCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_DEBT_COMPONENTS,
          disabled: true,
          width: 6,
        },
        {
          label: labelKey('debt.branchCode'),
          controlName: 'branchCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_BRANCHES,
          disabled: true,
          width: 6,
        },
        {
          label: labelKey('debt.statusCode'),
          controlName: 'statusCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_DEBT_STATUS,
          disabled: true,
          width: 6,
        },
        { label: labelKey('debt.debtAmount'), controlName: 'debtAmount', type: 'number', disabled: true, width: 6 },
        { label: labelKey('debt.totalAmount'), controlName: 'totalAmount', type: 'number', disabled: true, width: 6 },
        { label: labelKey('debt.currencyName'), controlName: 'currencyName', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.dpd'), controlName: 'dpd', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.startDate'), controlName: 'startDate', type: 'datepicker', disabled: true, width: 6 },
        {
          label: labelKey('debt.debtReasonCode'),
          controlName: 'debtReasonCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
          disabled: true,
          width: 6,
        },
        { label: labelKey('debt.dict1Code'), controlName: 'dict1Code', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.dict2Code'), controlName: 'dict2Code', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.dict3Code'), controlName: 'dict3Code', type: 'text', disabled: true, width: 6 },
        { label: labelKey('debt.dict4Code'), controlName: 'dict4Code', type: 'text', disabled: true, width: 6 },
        {
          label: labelKey('debt.lastPromStatusCode'),
          controlName: 'lastPromStatusCode',
          type: 'selectwrapper',
          dictCode: UserDictionariesService.DICTIONARY_PROMISE_STATUS,
          disabled: true,
          width: 6,
        },
        { label: labelKey('debt.lastPromDate'), controlName: 'lastPromDate', type: 'datepicker', disabled: true, width: 6 },
        { label: labelKey('debt.lastPayDate'), controlName: 'lastPayDate', type: 'datepicker', disabled: true, width: 6 },
        {
          label: labelKey('debt.lastCallDateTime'),
          controlName: 'lastCallDateTime',
          type: 'datepicker',
          disabled: true,
          width: 6
        },
        {
          label: labelKey('debt.lastVisitDateTime'),
          controlName: 'lastVisitDateTime',
          type: 'datepicker',
          disabled: true,
          width: 6,
        },
        {
          label: labelKey('debt.nextCallDateTime'),
          controlName: 'nextCallDateTime',
          type: 'datepicker',
          disabled: true,
          width: 6,
        },
        { label: labelKey('debt.debtComment'), controlName: 'debtComment', type: 'textarea', disabled: true, width: 12 },
      ],
    },
  ];

  constructor(
    private campaignService: CampaignService,
  ) {}

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this.campaignService.campaignDebt$;
  }
}
