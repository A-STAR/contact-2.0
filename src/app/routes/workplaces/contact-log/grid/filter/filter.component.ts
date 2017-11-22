import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';
import { FilterOperatorType } from '../../../../../shared/components/grid2/filter/grid-filter';

import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { FilterService } from './filter.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { FilterObject } from '../../../../../shared/components/grid2/filter/grid-filter';

import { makeKey, range } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactLog.filters.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-workplaces-contact-log-grid-filter',
  templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit {
  @Output() search = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private filterService: FilterService,
  ) {}

  ngOnInit(): void {
    Observable.combineLatest(
      this.entityAttributesService.getDictValueAttributes(),
      this.filterService.fetchUsers(),
    )
    .subscribe(([ attributes, users ]) => {
      this.controls = this.buildControls(attributes, users);
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

  private buildControls(attributes: IEntityAttributes, users: any[]): IDynamicFormControl[] {
    return [
      // TODO(d.maltsev): dialogmultiselect
      { controlName: 'portfolioId', type: 'number', min: 1 },
      // TODO(d.maltsev): dialogmultiselect
      { controlName: 'outPortfolioId', type: 'number', min: 1 },
      { controlName: 'branchCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
      { controlName: 'regionCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_REGIONS },
      ...range(1, 4).map(i => ({
        controlName: `dictValue${i}`,
        type: 'selectwrapper',
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
      })),
      // TODO(d.maltsev): dialogmultiselect wrapper that renders necessary grids and fetches data via filters service
      {
        controlName: 'userId',
        type: 'dialogmultiselect',
        gridColumnsFrom: [
          { prop: 'id' },
          { prop: 'lastName' },
          { prop: 'organization' },
          { prop: 'position' },
        ],
        gridColumnsTo: [
          { prop: 'lastName' },
        ],
        gridLabelGetter: row => row.lastName,
        gridRows: users,
        gridValueGetter: row => row.id,
      },
      { controlName: 'receiveDateTime', type: 'datepicker' },
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
