import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Component,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';

import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { FilterObject, FilterOperatorType } from '../../../../../shared/components/grid2/filter/grid-filter';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { range, makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.payments.filters.form');

@Component({
  selector: 'app-workplaces-payments-grid-filter',
  templateUrl: './payments-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFilterComponent implements OnInit {

  @Output() search = new EventEmitter<void>();

    @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    controls: IDynamicFormControl[];

    constructor(
      private cdRef: ChangeDetectorRef,
      private entityAttributesService: EntityAttributesService,
    ) {}

    ngOnInit(): void {
      this.entityAttributesService.getDictValueAttributes()
        .take(1)
        .subscribe(attributes => {
          this.controls = this.buildControls(attributes);
          this.cdRef.markForCheck();
        });
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
            .setValues(data[key]);
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
        { controlName: 'portfolioId', type: 'dialogmultiselectwrapper', filterType: 'portfolios' },
        { controlName: 'outPortfolioId', type: 'dialogmultiselectwrapper', filterType: 'portfolios' },
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
}
