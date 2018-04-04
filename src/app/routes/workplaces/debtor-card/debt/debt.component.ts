import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first, flatMap, map } from 'rxjs/operators';

import { IContextConfigItemType, IContextByValueBagMethod, IContextByEntityMethod } from '@app/core/context/context.interface';
import { IDebt } from '@app/core/app-modules/app-modules.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '@app/core/entity/attributes/entity-attributes.interface';
import { ILookupPortfolio } from '@app/core/lookup/lookup.interface';
import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IMetadataFormItem,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';
import { IOption, IOptionSet } from '@app/core/converter/value-converter.interface';
import { IUserPermission, IUserPermissions } from '@app/core/user/permissions/user-permissions.interface';

import { DebtService } from '@app/core/debt/debt.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, addGridLabel, range } from '@app/core/utils';

const label = makeKey('widgets.debt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-card',
  templateUrl: './debt.component.html',
})
export class DebtComponent implements OnInit {
  @ViewChild('form') form: DynamicFormComponent;

  readonly config: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        children: [
          {
            disabled: true,
            display: true,
            label: 'widgets.debt.grid.id',
            name: 'id',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
          {
            disabled: true,
            display: true,
            label: 'widgets.debt.grid.bankId',
            lookupKey: 'contractors',
            name: 'bankId',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
          {
            disabled: {
              type: IContextConfigItemType.PERMISSION,
              method: IContextByValueBagMethod.HAS,
              value: 'DEBT_EDIT',
            },
            display: true,
            label: 'widgets.debt.grid.contract',
            name: 'contract',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
        ],
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
      {
        children: [
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.creditName',
            name: 'creditName',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
          {
            dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.creditTypeCode',
            name: 'creditTypeCode',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.creditStartDate',
            name: 'creditStartDate',
            type: IMetadataFormControlType.DATE,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.creditEndDate',
            name: 'creditEndDate',
            type: IMetadataFormControlType.DATE,
            validators: {},
            width: 1,
          },
        ],
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
      {
        children: [
          {
            dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.debtReasonCode',
            name: 'debtReasonCode',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.startDate',
            name: 'startDate',
            type: IMetadataFormControlType.DATE,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.dpd',
            name: 'dpd',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.currencyId',
            lookupKey: 'currencies',
            name: 'currencyId',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.debtAmount',
            name: 'debtAmount',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.totalAmount',
            name: 'totalAmount',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
        ],
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
      {
        children: [
          {
            dictCode: UserDictionariesService.DICTIONARY_DEBTOR_STAGE_CODE,
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.stageCode',
            name: 'stageCode',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.debtDate',
            name: 'debtDate',
            type: IMetadataFormControlType.DATE,
            validators: {},
            width: 1,
          },
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.account',
            name: 'account',
            type: IMetadataFormControlType.TEXT,
            validators: {},
            width: 1,
          },
          {
            dictCode: UserDictionariesService.DICTIONARY_REGIONS,
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.regionCode',
            name: 'regionCode',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
          {
            dictCode: UserDictionariesService.DICTIONARY_BRANCHES,
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.branchCode',
            name: 'branchCode',
            type: IMetadataFormControlType.SELECT,
            validators: {},
            width: 1,
          },
        ],
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
      {
        children: range(1, 4).map(i => ({
          dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
          disabled: {
            type: IContextConfigItemType.PERMISSION,
            method: IContextByValueBagMethod.HAS,
            value: `DEBT_DICT${i}_EDIT_LIST`,
          },
          display: {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_USED,
            value: EntityAttributesService[`DICT_VALUE_${i}`],
          },
          label: `widgets.debt.grid.dict${i}Code`,
          name: `dict${i}Code`,
          type: IMetadataFormControlType.SELECT,
          validators: {
            required: {
              type: IContextConfigItemType.ENTITY,
              method: IContextByEntityMethod.IS_MANDATORY,
              value: EntityAttributesService[`DICT_VALUE_${i}`],
            }
          },
          width: 1,
        } as IMetadataFormItem)),
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
      {
        children: [
          {
            disabled: false,
            display: true,
            label: 'widgets.debt.grid.comment',
            name: 'comment',
            type: IMetadataFormControlType.TEXTAREA,
            validators: {},
            width: 1,
          },
        ],
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
    ],
  };

  controls: Array<IDynamicFormItem> = null;
  debt: IDebt;
  tabs = [
    { title: label('component.title'), isInitialised: true },
    { title: label('portfolioLog.title'), isInitialised: false },
    { title: label('componentLog.title'), isInitialised: false }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private debtorCardService: DebtorCardService,
    private entityAttributesService: EntityAttributesService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.lookupService.portfolios,
      this.userDictionariesService.getDictionariesAsOptions([
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
      portfolios,
      dictionaries,
      attributes,
      debtEditPerm,
      debtPortfolioEditPerm,
      debtComponentAmountEditPerm,
      dictPermissions,
    ]) => {
      this.controls = this.initControls(
        portfolios,
        <any>dictionaries,
        <any>attributes,
        <any>debtEditPerm,
        <any>debtPortfolioEditPerm,
        <any>debtComponentAmountEditPerm,
        <any>dictPermissions,
      );
      this.cdRef.markForCheck();
    });

    this.debtId$.pipe(
      flatMap(debtId => debtId ? this.debtService.fetch(null, debtId) : of(null)),
      first(),
    )
    .subscribe(debt => {
      this.debt = debt;
      this.cdRef.markForCheck();
    });
  }

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$.pipe(
      map(debtId => this.isRoute('create') ? null : debtId),
    );
  }

  onSubmit(): void {
    combineLatest(
      this.debtorCardService.personId$,
      this.debtId$,
    )
    .pipe(
      first(),
      flatMap(([personId, debtId]) => {
        return debtId
          ? this.debtService.update(personId, debtId, this.form.serializedUpdates)
          : this.debtService.create(personId, this.form.serializedUpdates);
      })
    )
    .subscribe(() => {
      this.debtorCardService.refreshDebts();
      this.onBack();
    });
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    this.routingService.navigate([ `/app/workplaces/debtor-card/${debtId}` ]);
  }

  get displayDebtData(): Observable<boolean> {
    return this.debtorCardService.selectedDebt$.pipe(map(Boolean));
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

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
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
    portfolios: Array<ILookupPortfolio>,
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
        width: 3
      },
      {
        label: 'widgets.debt.grid.portfolioId',
        controlName: 'portfolioId',
        type: 'gridselect',
        gridColumns: [
          { prop: 'id', minWidth: 50, maxWidth: 50 },
          { prop: 'name', minWidth: 100, maxWidth: 300 },
          { prop: 'contractor', minWidth: 100, maxWidth: 300 },
        ].map(addGridLabel('widgets.debt.portfolioChange.grid')),
        gridRows: portfolios,
        gridLabelGetter: (row: ILookupPortfolio) => row.name,
        gridValueGetter: (row: ILookupPortfolio) => row.id,
        gridOnSelect: (row: ILookupPortfolio) => this.form.form.patchValue({ bankId: row && row.contractorId }),
        disabled: !debtPortfolioEditPerm,
        required: true,
        width: 3
      },
      {
        label: 'widgets.debt.grid.bankId',
        controlName: 'bankId',
        type: 'select',
        lookupKey: 'contractors',
        disabled: true,
        width: 3
      },
      {
        label: 'widgets.debt.grid.contract',
        controlName: 'contract',
        type: 'text',
        disabled: !debtEditPerm,
        width: 3
      },
      // Row 2
      {
        label: 'widgets.debt.grid.creditName',
        controlName: 'creditName',
        type: 'text',
        disabled: !debtEditPerm,
        width: 3
      },
      {
        label: 'widgets.debt.grid.creditTypeCode',
        controlName: 'creditTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
        disabled: !debtEditPerm,
        width: 3
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
        dictCode: UserDictionariesService.DICTIONARY_REGIONS,
        disabled: !debtEditPerm,
        width: 3
      },
      {
        label: 'widgets.debt.grid.branchCode',
        controlName: 'branchCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_BRANCHES,
        disabled: !debtEditPerm,
        width: 3
      },
      // Row 4
      {
        label: 'widgets.debt.grid.debtReasonCode',
        controlName: 'debtReasonCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_DEBT_ORIGINATION_REASON,
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
        lookupKey: 'currencies',
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
          required: !!attributes[EntityAttributesService.DICT_VALUE_1].isMandatory,
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
          required: !!attributes[EntityAttributesService.DICT_VALUE_2].isMandatory,
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
          required: !!attributes[EntityAttributesService.DICT_VALUE_3].isMandatory,
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
          required: !!attributes[EntityAttributesService.DICT_VALUE_4].isMandatory,
          width: 3
        }
        : null,
      // Row 6
      {
        label: 'widgets.debt.grid.stageCode',
        controlName: 'stageCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_DEBTOR_STAGE_CODE,
        disabled: !debtEditPerm,
        width: 3,
      },
      {
        label: 'widgets.debt.grid.debtDate',
        controlName: 'debtDate',
        type: 'datepicker',
        disabled: !debtEditPerm,
        width: 3
      },
      {
        label: 'widgets.debt.grid.account',
        controlName: 'account',
        type: 'text',
        disabled: !debtEditPerm,
        width: 3
      },
      // Row 7
      {
        label: 'widgets.debt.grid.comment',
        controlName: 'comment',
        type: 'textarea',
        disabled: !debtEditPerm,
      }
    ].filter(c => c !== null) as Array<IDynamicFormItem>;
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
