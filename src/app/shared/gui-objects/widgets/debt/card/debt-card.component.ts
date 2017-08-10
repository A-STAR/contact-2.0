import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDebt, IDebtComponent } from '../debt.interface';
import { IDynamicFormItem } from '../../../../components/form/dynamic-form/dynamic-form-control.interface';
import { IGridColumn } from '../../../../components/grid/grid.interface';
import { ILookupPortfolio } from '../../../../../core/lookup/lookup.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../debt.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
// import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-card',
  templateUrl: './debt-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  // TODO(d.maltsev): is there a better way to get route params?
  private id = (this.route.params as any).value.id || null;
  private debtId = (this.route.params as any).value.debtId || null;

  controls: Array<IDynamicFormItem> = null;
  debt: IDebt;

  componentsColumns: Array<IGridColumn> = [
    { prop: 'typeCode', minWidth: 150, maxWidth: 200 },
    { prop: 'sum', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyId', minWidth: 150, maxWidth: 200 },
  ];
  componentsRows: Array<IDebtComponent> = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    // private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    Observable.combineLatest(
      this.lookupService.portfolios,
      this.lookupService.contractorOptions,
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
        UserDictionariesService.DICTIONARY_BRANCHES,
        UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
        UserDictionariesService.DICTIONARY_REGIONS,
      ]),
      this.debtId ? this.debtService.fetch(this.id, this.debtId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ portfolios, contractorOptions, dictionaryOptions, debt ]) => {
      const portfolioOptions = {
        gridColumns: [
          { prop: 'id', minWidth: 50, maxWidth: 50 },
          { prop: 'name', minWidth: 100, maxWidth: 300 },
          { prop: 'contractor', minWidth: 100, maxWidth: 300 },
        ],
        gridRows: portfolios,
        gridLabelGetter: (row: ILookupPortfolio) => row.name,
        gridValueGetter: (row: ILookupPortfolio) => row.id,
        gridOnSelect: (row: ILookupPortfolio) => console.log(row)
      };
      const creditTypeOptions = {
        options: dictionaryOptions[UserDictionariesService.DICTIONARY_PRODUCT_TYPE]
      };
      const regionOptions = {
        options: dictionaryOptions[UserDictionariesService.DICTIONARY_REGIONS]
      };
      const branchOptions = {
        options: dictionaryOptions[UserDictionariesService.DICTIONARY_BRANCHES]
      };
      const reasonOptions = {
        options: dictionaryOptions[UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON]
      };
      this.controls = [
        {
          width: 6,
          children: [
            { label: 'widgets.debt.grid.id', controlName: 'id', type: 'text', disabled: true },
            { label: 'widgets.debt.grid.portfolioId', controlName: 'portfolioId', type: 'gridselect', ...portfolioOptions },
            { label: 'widgets.debt.grid.bankId', controlName: 'bankId', type: 'select', disabled: true, options: contractorOptions },
            { label: 'widgets.debt.grid.creditName', controlName: 'creditName', type: 'text' },
            { label: 'widgets.debt.grid.creditTypeCode', controlName: 'creditTypeCode', type: 'select', ...creditTypeOptions  },
            { label: 'widgets.debt.grid.contract', controlName: 'contract', type: 'text' },
            { label: 'widgets.debt.grid.creditStartDate', controlName: 'creditStartDate', type: 'datepicker' },
            { label: 'widgets.debt.grid.creditEndDate', controlName: 'creditEndDate', type: 'datepicker' },
            { label: 'widgets.debt.grid.regionCode', controlName: 'regionCode', type: 'select', ...regionOptions },
            { label: 'widgets.debt.grid.branchCode', controlName: 'branchCode', type: 'select', ...branchOptions },
          ]
        },
        {
          width: 6,
          children: [
            { label: 'widgets.debt.grid.debtReasonCode', controlName: 'debtReasonCode', type: 'select', ...reasonOptions },
            { label: 'widgets.debt.grid.startDate', controlName: 'startDate', type: 'datepicker' },
            { label: 'widgets.debt.grid.dpd', controlName: 'dpd', type: 'text' },
            { label: 'widgets.debt.grid.currencyId', controlName: 'currencyId', type: 'text' },
            { label: 'widgets.debt.grid.debtSum', controlName: 'debtSum', type: 'text' },
            { label: 'widgets.debt.grid.totalSum', controlName: 'totalSum', type: 'text' },
            { label: 'widgets.debt.grid.dict1Code', controlName: 'dict1Code', type: 'text' },
            { label: 'widgets.debt.grid.dict2Code', controlName: 'dict2Code', type: 'text' },
            { label: 'widgets.debt.grid.dict3Code', controlName: 'dict3Code', type: 'text' },
            { label: 'widgets.debt.grid.dict4Code', controlName: 'dict4Code', type: 'text' },
          ]
        }
      ];
      this.debt = {
        ...debt,
        creditStartDate: this.valueConverterService.fromISO(debt.creditStartDate as string),
        creditEndDate: this.valueConverterService.fromISO(debt.creditEndDate as string),
        startDate: this.valueConverterService.fromISO(debt.startDate as string),
      };
      this.cdRef.markForCheck();
    });

    this.debtService.fetchComponents(this.debtId).subscribe(components => {
      this.componentsRows = components;
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const { value } = this.form;
    const data = {
      ...value,
      typeCode: Array.isArray(value.typeCode) ? value.typeCode[0].value : value.typeCode
    }

    const action = this.debtId
      ? this.debtService.update(this.id, this.debtId, data)
      : this.debtService.create(this.id, data);

    action.subscribe(() => this.onBack());
  }

  onBack(): void {
    this.contentTabService.back();
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }
}
