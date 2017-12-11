import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { ICampaignDebt } from '../campaign.interface';
import { IDynamicFormGroup, IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';

import { CampaignService } from '../campaign.service';
import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey, range } from '../../../../../core/utils';

const labelKey = makeKey('modules.callCenter.overview');

@Component({
  selector: 'app-call-center-overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {
  controls: IDynamicFormGroup[];

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

  private buildControls(attirbutes: IEntityAttributes): IDynamicFormGroup[] {
    return [
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
          { label: labelKey('debtor.personFullName'), controlName: 'personFullName', type: 'text', disabled: true, width: 6 },
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
          {
            label: labelKey('debt.creditStartDate'),
            controlName: 'creditStartDate',
            type: 'datepicker',
            disabled: true,
            width: 6,
          },
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
          ...range(1, 4).map(i => ({
            label: labelKey(`debt.dict${i}Code`),
            controlName: `dict${i}Code`,
            type: 'selectwrapper',
            dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
            disabled: true,
            display: attirbutes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
            width: 6,
          } as IDynamicFormItem)),
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
  }
}
