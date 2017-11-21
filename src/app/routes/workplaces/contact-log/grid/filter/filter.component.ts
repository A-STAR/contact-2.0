import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';
import { FilterOperatorType } from '../../../../../shared/components/grid2/filter/grid-filter';

import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { FilterService } from './filter.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { MultiSelectComponent } from '../../../../../shared/components/form/multi-select/multi-select.component';

import { DialogFunctions } from '../../../../../core/dialog';
import { FilterObject } from '../../../../../shared/components/grid2/filter/grid-filter';

import { makeKey, range } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactLog.filters.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-workplaces-contact-log-grid-filter',
  templateUrl: 'filter.component.html'
})
export class FilterComponent extends DialogFunctions implements OnInit {
  @Output() search = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild('usersSelect') usersSelect: MultiSelectComponent;

  controls: IDynamicFormControl[];
  data: any = {};
  dialog: string;

  users = [];
  userColumns: IGridColumn[] = [
    { prop: 'id', width: 100 },
    { prop: 'fullName' },
    { prop: 'organization' },
    { prop: 'position' },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private filterService: FilterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.filterService.fetchUsers().subscribe(users => {
      this.users = users;
      this.cdRef.markForCheck();
    });

    this.entityAttributesService.getDictValueAttributes()
      .subscribe(attributes => {
        this.controls = this.buildControls(attributes);
        this.cdRef.markForCheck();
      });
  }

  get filters(): FilterObject {
    const filter = FilterObject.create().and();
    const data = this.form.serializedValue;
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

  onUsersFilterSelect(): void {
    this.data = {
      ...this.data,
      userId: this.usersSelect.rowsTo.map(user => user.id)
    };
    this.closeDialog();
    this.cdRef.markForCheck();
  }

  private buildControls(attributes: IEntityAttributes): IDynamicFormControl[] {
    return [
      { controlName: 'portfolioId', type: 'text' },
      { controlName: 'outPortfolioId', type: 'number', min: 1 },
      { controlName: 'branchCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
      { controlName: 'regionCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_REGIONS },
      ...range(1, 4).map(i => ({
        controlName: `dictValue${i}`,
        type: 'selectwrapper',
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
      })),
      { controlName: 'userId', type: 'dialog', action: () => this.setDialog('userId') },
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
