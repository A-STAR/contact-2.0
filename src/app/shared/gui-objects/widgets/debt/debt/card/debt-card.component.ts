import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IDebt } from '../debt.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form-control.interface';
import { ILookupPortfolio } from '../../../../../../core/lookup/lookup.interface';
import { IOption, IOptionSet } from '../../../../../../core/converter/value-converter.interface';
import { IUserPermissions } from '../../../../../../core/user/permissions/user-permissions.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../debt.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

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

  private contractorOptions: Array<IOption> = [];

  controls: Array<IDynamicFormItem> = null;
  debt: IDebt;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
  ) {
    Observable.combineLatest(
      this.lookupService.portfolios,
      this.lookupService.contractorOptions,
      this.lookupService.currencyOptions,
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
        UserDictionariesService.DICTIONARY_BRANCHES,
        UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
        UserDictionariesService.DICTIONARY_REGIONS,
        UserDictionariesService.DICTIONARY_DEBT_LIST_1,
        UserDictionariesService.DICTIONARY_DEBT_LIST_2,
        UserDictionariesService.DICTIONARY_DEBT_LIST_3,
        UserDictionariesService.DICTIONARY_DEBT_LIST_4,
      ]),
      this.userPermissionsService.get([
        'DEBT_EDIT',
        'DEBT_PORTFOLIO_EDIT',
        'DEBT_COMPONENT_SUM_EDIT',
        'DEBT_DICT1_EDIT_LIST',
        'DEBT_DICT2_EDIT_LIST',
        'DEBT_DICT3_EDIT_LIST',
        'DEBT_DICT4_EDIT_LIST',
      ]),
      this.debtId ? this.debtService.fetch(this.id, this.debtId) : Observable.of(null)
    )
    .take(1)
    .subscribe(([ portfolios, contractorOptions, currencyOptions, dictionaries, permissions, debt ]) => {
      this.contractorOptions = contractorOptions;
      this.controls = this.initControls(portfolios, contractorOptions, currencyOptions, dictionaries, permissions);
      this.debt = {
        ...debt,
        creditStartDate: this.valueConverterService.fromISO(debt.creditStartDate as string),
        creditEndDate: this.valueConverterService.fromISO(debt.creditEndDate as string),
        startDate: this.valueConverterService.fromISO(debt.startDate as string),
      };
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

  private initControls(
    portfolios: Array<ILookupPortfolio>,
    contractorOptions: Array<IOption>,
    currencyOptions: Array<IOption>,
    dictionaries: IOptionSet,
    permissions: IUserPermissions,
  ): any {
    return [
      // Row 1
      {
        label: 'widgets.debt.grid.id',
        controlName: 'id',
        type: 'text',
        disabled: true,
        width: 2
      },
      {
        label: 'widgets.debt.grid.portfolioId',
        controlName: 'portfolioId',
        type: 'gridselect',
        gridColumns: [
          { prop: 'id', minWidth: 50, maxWidth: 50 },
          { prop: 'name', minWidth: 100, maxWidth: 300 },
          { prop: 'contractor', minWidth: 100, maxWidth: 300 },
        ],
        gridRows: portfolios,
        gridLabelGetter: (row: ILookupPortfolio) => row.name,
        gridValueGetter: (row: ILookupPortfolio) => row.id,
        gridOnSelect: (row: ILookupPortfolio) => this.form.form.patchValue({ bankId: row && row.contractorId }),
        disabled: !permissions['DEBT_PORTFOLIO_EDIT'].valueB,
        width: 5
      },
      {
        label: 'widgets.debt.grid.bankId',
        controlName: 'bankId',
        type: 'select',
        options: contractorOptions,
        disabled: true,
        width: 5
      },
      // Row 2
      {
        label: 'widgets.debt.grid.creditName',
        controlName: 'creditName',
        type: 'text',
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 4
      },
      {
        label: 'widgets.debt.grid.creditTypeCode',
        controlName: 'creditTypeCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_PRODUCT_TYPE],
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 4
      },
      {
        label: 'widgets.debt.grid.contract',
        controlName: 'contract',
        type: 'text',
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 4
      },
      // Row 3
      {
        label: 'widgets.debt.grid.creditStartDate',
        controlName: 'creditStartDate',
        type: 'datepicker',
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 3
      },
      {
        label: 'widgets.debt.grid.creditEndDate',
        controlName: 'creditEndDate',
        type: 'datepicker',
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 3
      },
      {
        label: 'widgets.debt.grid.regionCode',
        controlName: 'regionCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_REGIONS],
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 3
      },
      {
        label: 'widgets.debt.grid.branchCode',
        controlName: 'branchCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_BRANCHES],
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 3
      },
      // Row 4
      {
        label: 'widgets.debt.grid.debtReasonCode',
        controlName: 'debtReasonCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON],
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 2
      },
      {
        label: 'widgets.debt.grid.startDate',
        controlName: 'startDate',
        type: 'datepicker',
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 2
      },
      {
        label: 'widgets.debt.grid.dpd',
        controlName: 'dpd',
        type: 'text',
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 2
      },
      {
        label: 'widgets.debt.grid.currencyId',
        controlName: 'currencyId',
        type: 'select',
        options: currencyOptions,
        disabled: !permissions['DEBT_EDIT'].valueB,
        width: 2
      },
      {
        label: 'widgets.debt.grid.debtSum',
        controlName: 'debtSum',
        type: 'text',
        disabled: !permissions['DEBT_COMPONENT_SUM_EDIT'].valueB,
        width: 2
      },
      {
        label: 'widgets.debt.grid.totalSum',
        controlName: 'totalSum',
        type: 'text',
        disabled: !permissions['DEBT_COMPONENT_SUM_EDIT'].valueB,
        width: 2
      },
      // Row 5
      {
        label: 'widgets.debt.grid.dict1Code',
        controlName: 'dict1Code',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_1],
        disabled: !permissions['DEBT_DICT1_EDIT_LIST'].valueS,
        width: 3
      },
      {
        label: 'widgets.debt.grid.dict2Code',
        controlName: 'dict2Code',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_2],
        disabled: !permissions['DEBT_DICT2_EDIT_LIST'].valueS,
        width: 3
      },
      {
        label: 'widgets.debt.grid.dict3Code',
        controlName: 'dict3Code',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_3],
        disabled: !permissions['DEBT_DICT3_EDIT_LIST'].valueS,
        width: 3
      },
      {
        label: 'widgets.debt.grid.dict4Code',
        controlName: 'dict4Code',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_4],
        disabled: !permissions['DEBT_DICT4_EDIT_LIST'].valueS,
        width: 3
      },
      // Row 6
      {
        label: 'widgets.debt.grid.comment',
        controlName: 'comment',
        type: 'textarea',
        disabled: !permissions['DEBT_EDIT'].valueB,
      }
    ];
  }
}
