import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import 'rxjs/add/observable/combineLatest';

import { IDebt } from '../debt.interface';
import { IDynamicFormItem } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../../core/entity/attributes/entity-attributes.interface';
import { ILookupPortfolio } from '../../../../../../core/lookup/lookup.interface';
import { IOption, IOptionSet } from '../../../../../../core/converter/value-converter.interface';
import { IUserPermission, IUserPermissions } from '../../../../../../core/user/permissions/user-permissions.interface';

import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { DebtService } from '../debt.service';
import { EntityAttributesService } from '../../../../../../core/entity/attributes/entity-attributes.service';
import { LookupService } from '../../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-debt-card',
  templateUrl: './debt-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardComponent {
  @ViewChild('form') form: DynamicFormComponent;

  private id = (this.route.params as any).value.personId || null;
  debtId = (this.route.params as any).value.debtId || null;

  private contractorOptions: Array<IOption> = [];

  controls: Array<IDynamicFormItem> = null;
  debt: IDebt;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private debtService: DebtService,
    private entityAttributesService: EntityAttributesService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.lookupService.contractorOptions,
      this.debtId ? this.debtService.fetch(this.id, this.debtId) : Observable.of(null),
      this.lookupService.portfolios,
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
      this.entityAttributesService.getDictValueAttributes(),
      this.userPermissionsService.has('DEBT_EDIT'),
      this.userPermissionsService.has('DEBT_PORTFOLIO_EDIT'),
      this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_EDIT'),
      this.userPermissionsService.get([
        'DEBT_DICT1_EDIT_LIST',
        'DEBT_DICT2_EDIT_LIST',
        'DEBT_DICT3_EDIT_LIST',
        'DEBT_DICT4_EDIT_LIST'
      ]),
    )
    .pipe(first())
    .subscribe(([
      contractorOptions, debt, portfolios, currencyOptions, dictionaries, attributes,
      debtEditPerm,
      debtPortfolioEditPerm,
      debtComponentAmountEditPerm,
      dictPermissions,
    ]) => {
      this.contractorOptions = contractorOptions;
      this.controls = this.initControls(
        contractorOptions, portfolios, currencyOptions, dictionaries, attributes,
        debtEditPerm,
        debtPortfolioEditPerm,
        debtComponentAmountEditPerm,
        dictPermissions,
      );
      this.debt = debt;
      this.cdRef.markForCheck();
    });
  }

  onSubmit(): void {
    const action = this.debtId
      ? this.debtService.update(this.id, this.debtId, this.form.serializedUpdates)
      : this.debtService.create(this.id, this.form.serializedUpdates);
    action.subscribe(() => this.onBack());
  }

  onBack(): void {
    this.contentTabService.back();
  }

  get displayDebtData(): boolean {
    return !!this.debtId;
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get canViewComponentLog$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  }

  get canViewPortfolioLog$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');
  }

  private filterOptions(options: Array<IOption>, permission: IUserPermission): Array<IOption> {
    if (permission.valueS === 'ALL') {
      return options;
    }
    if (!permission.valueS) {
      return [];
    }
    const values = permission.valueS.split(',');
    return options.filter(option => values.includes(String(option.value)));
  }

  private initControls(
    contractorOptions: Array<IOption>,
    portfolios: Array<ILookupPortfolio>,
    currencyOptions: Array<IOption>,
    dictionaries: IOptionSet,
    attributes: IEntityAttributes,
    debtEditPerm: boolean,
    debtPortfolioEditPerm: boolean,
    debtComponentAmountEditPerm: boolean,
    dictPermissions: IUserPermissions,
  ): Array<IDynamicFormItem> {
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
        disabled: !debtPortfolioEditPerm,
        required: true,
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
        disabled: !debtEditPerm,
        width: 4
      },
      {
        label: 'widgets.debt.grid.creditTypeCode',
        controlName: 'creditTypeCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_PRODUCT_TYPE],
        disabled: !debtEditPerm,
        width: 4
      },
      {
        label: 'widgets.debt.grid.contract',
        controlName: 'contract',
        type: 'text',
        disabled: !debtEditPerm,
        width: 4
      },
      // Row 3
      {
        label: 'widgets.debt.grid.creditStartDate',
        controlName: 'creditStartDate',
        type: 'datepicker',
        disabled: !debtEditPerm,
        width: 3
      },
      {
        label: 'widgets.debt.grid.creditEndDate',
        controlName: 'creditEndDate',
        type: 'datepicker',
        disabled: !debtEditPerm,
        width: 3
      },
      {
        label: 'widgets.debt.grid.regionCode',
        controlName: 'regionCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_REGIONS],
        disabled: !debtEditPerm,
        width: 3
      },
      {
        label: 'widgets.debt.grid.branchCode',
        controlName: 'branchCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_BRANCHES],
        disabled: !debtEditPerm,
        width: 3
      },
      // Row 4
      {
        label: 'widgets.debt.grid.debtReasonCode',
        controlName: 'debtReasonCode',
        type: 'select',
        options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON],
        disabled: !debtEditPerm,
        width: 2
      },
      {
        label: 'widgets.debt.grid.startDate',
        controlName: 'startDate',
        type: 'datepicker',
        disabled: !debtEditPerm,
        width: 2
      },
      {
        label: 'widgets.debt.grid.dpd',
        controlName: 'dpd',
        type: 'text',
        disabled: !debtEditPerm,
        width: 2
      },
      {
        label: 'widgets.debt.grid.currencyId',
        controlName: 'currencyId',
        type: 'select',
        options: currencyOptions,
        disabled: !debtEditPerm,
        required: true,
        width: 2
      },
      {
        label: 'widgets.debt.grid.debtAmount',
        controlName: 'debtAmount',
        type: 'text',
        disabled: !debtComponentAmountEditPerm,
        required: true,
        width: 2
      },
      {
        label: 'widgets.debt.grid.totalAmount',
        controlName: 'totalAmount',
        type: 'text',
        disabled: !debtComponentAmountEditPerm,
        width: 2
      },
      // Row 5
      attributes[EntityAttributesService.DICT_VALUE_1].isUsed
        ? {
          label: 'widgets.debt.grid.dict1Code',
          controlName: 'dict1Code',
          type: 'select',
          options: this.filterOptions(
            dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_1], dictPermissions['DEBT_DICT1_EDIT_LIST']
          ),
          disabled: !dictPermissions['DEBT_DICT1_EDIT_LIST'].valueS,
          required: attributes[EntityAttributesService.DICT_VALUE_1].isMandatory,
          width: 3
        }
        : null,
      attributes[EntityAttributesService.DICT_VALUE_2].isUsed
        ? {
          label: 'widgets.debt.grid.dict2Code',
          controlName: 'dict2Code',
          type: 'select',
          options: this.filterOptions(
            dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_2], dictPermissions['DEBT_DICT2_EDIT_LIST']
          ),
          disabled: !dictPermissions['DEBT_DICT2_EDIT_LIST'].valueS,
          required: attributes[EntityAttributesService.DICT_VALUE_2].isMandatory,
          width: 3
        }
        : null,
      attributes[EntityAttributesService.DICT_VALUE_3].isUsed
        ? {
          label: 'widgets.debt.grid.dict3Code',
          controlName: 'dict3Code',
          type: 'select',
          options: this.filterOptions(
            dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_3], dictPermissions['DEBT_DICT3_EDIT_LIST']
          ),
          disabled: !dictPermissions['DEBT_DICT3_EDIT_LIST'].valueS,
          required: attributes[EntityAttributesService.DICT_VALUE_3].isMandatory,
          width: 3
        }
        : null,
      attributes[EntityAttributesService.DICT_VALUE_4].isUsed
        ? {
          label: 'widgets.debt.grid.dict4Code',
          controlName: 'dict4Code',
          type: 'select',
          options: this.filterOptions(
            dictionaries[UserDictionariesService.DICTIONARY_DEBT_LIST_4], dictPermissions['DEBT_DICT4_EDIT_LIST']
          ),
          disabled: !dictPermissions['DEBT_DICT4_EDIT_LIST'].valueS,
          required: attributes[EntityAttributesService.DICT_VALUE_4].isMandatory,
          width: 3
        }
        : null,
      // Row 6
      {
        label: 'widgets.debt.grid.comment',
        controlName: 'comment',
        type: 'textarea',
        disabled: !debtEditPerm,
      }
    ].filter(c => c !== null) as Array<IDynamicFormItem>;
  }
}
