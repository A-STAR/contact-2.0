import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Component,
  OnInit,
  Output,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IAppState } from '../../../../../core/state/state.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';
import { FilterObject, FilterOperatorType } from '../../../../../shared/components/grid2/filter/grid-filter';
import { TYPE_CODES } from '../../../../../core/utils/value';

import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { range, makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.payments.filters.form');

@Component({
  selector: 'app-workplaces-payments-grid-filter',
  templateUrl: './payments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFilterComponent implements OnInit, OnDestroy {

  @Output() search = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  private paymentDateTimeFormat: number;
  private metadataSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService
  ) { }

  ngOnInit(): void {
    this.entityAttributesService.getDictValueAttributes()
      .take(1)
      .subscribe(attributes => {
        this.controls = this.buildControls(attributes);
        this.cdRef.markForCheck();
      });

    this.metadataSub = this.store
      .select(state => state.metadata)
      .filter(Boolean)
      .map(metadata => metadata.payments)
      .filter(Boolean)
      .map(payments => payments.columns)
      .map(columns => columns.find(column => column.name === 'paymentDateTime'))
      .map(column => column.dataType)
      .subscribe(columnDataType => this.paymentDateTimeFormat = columnDataType);
  }

  ngOnDestroy(): void {
    if (this.metadataSub) {
      this.metadataSub.unsubscribe();
    }
  }

  get filters(): FilterObject {
    const filter = FilterObject.create().and();
    const data = this.form && this.form.serializedValue || {};
    Object.keys(data).forEach(key => {
      if (data[key]) {
        const f = FilterObject
          .create()
          .setName(key)
          .setOperator(this.getOperatorForControl(key))
          .setValues(this.transformFilterValue(key, data[key]));
        filter.addFilter(f);
      }
    });
    return filter;
  }

  onSearch(): void {
    this.search.emit();
  }

  private buildControls(attributes: IEntityAttributes): IDynamicFormControl[] {
    return [
      {
        controlName: 'portfolioId',
        type: 'dialogmultiselectwrapper',
        filterType: 'portfolios',
        filterParams: { directionCodes: [1] }
      },
      {
        controlName: 'outPortfolioId',
        type: 'dialogmultiselectwrapper',
        filterType: 'portfolios',
        filterParams: { directionCodes: [2] }
      },
      { controlName: 'branchCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
      { controlName: 'regionCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_REGIONS },
      ...range(1, 4).map(i => ({
        controlName: `dictValue${i}`,
        type: 'selectwrapper',
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
      })),
      { controlName: 'userId', type: 'dialogmultiselectwrapper', filterType: 'users' },
      { controlName: 'paymentDateTime', type: 'datepicker' },
      {
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        action: () => this.onSearch(),
      },
    ]
      .map(control => ({
        ...control,
        label: labelKey(control.controlName),
        width: 3
      } as IDynamicFormControl));
  }

  private getOperatorForControl(controlName: string): FilterOperatorType {
    const control = this.controls.find(c => c.controlName === controlName);
    switch (control.controlName) {
      case 'userId':
        return 'IN';
      default:
        return '==';
    }
  }

  private transformFilterValue(key: string, value: any): any {
    switch (key) {
      case 'paymentDateTime':
        return this.paymentDateTimeFormat === TYPE_CODES.DATETIME ? this.valueConverterService.dateStringToISO(value) : value;
      default:
        return value;
    }
  }
}
