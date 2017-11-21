import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';

import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey, range } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactLog.filters');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-workplaces-contact-log-grid-filter',
  templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit {
  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
  ) {}

  ngOnInit() {
    this.entityAttributesService.getDictValueAttributes()
      .subscribe(attributes => {
        this.controls = this.buildControls(attributes);
        this.cdRef.markForCheck();
      });
  }

  private buildControls(attributes: IEntityAttributes): IDynamicFormControl[] {
    return [
      { controlName: 'portfolioId', type: 'text' },
      { controlName: 'outPortfolioId', type: 'text' },
      { controlName: 'branchCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
      { controlName: 'regionCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_REGIONS },
      ...range(1, 4).map(i => ({
        controlName: `dictValue${i}`,
        type: 'selectwrapper',
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
      })),
      { controlName: 'userId', type: 'text' },
      { controlName: 'receiveDateTime', type: 'datepicker' },
    ]
    .map(control => ({
      ...control,
      label: labelKey(control.controlName),
      width: 3
    } as IDynamicFormControl));
  }
}
