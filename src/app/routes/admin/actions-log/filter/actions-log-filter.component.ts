import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';

import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { timeToHourMinSec } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-actions-log-filter',
  styleUrls: [ './actions-log-filter.component.scss' ],
  templateUrl: './actions-log-filter.component.html',
})
export class ActionsLogFilterComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Output() export = new EventEmitter<void>();
  @Output() queryBuilderOpen = new EventEmitter<void>();
  @Output() search = new EventEmitter<void>();

  controls: IDynamicFormItem[];
  data: any;

  constructor() {}

  ngOnInit(): void {
    const start = moment().startOf('month').toDate();
    const end = moment().endOf('month').toDate();

    this.data = {
      startDate: start,
      // startTime should be preset to '00:00:00'
      startTime: start,
      endDate: end,
      // endTime should be preset '23:59:59'
      endTime: end,
    };

    this.controls = [
      {
        children: [
          {
            controlName: 'startDate',
            label: 'default.dateTimeRange.from',
            required: true,
            type: 'datepicker',
            width: 4,
          },
          {
            controlName: 'startTime',
            label: null,
            required: true,
            type: 'timepicker',
            width: 2,
          },
          {
            controlName: 'endDate',
            label: 'default.dateTimeRange.to',
            required: true,
            type: 'datepicker',
            width: 4,
          },
          {
            controlName: 'endTime',
            label: null,
            required: true,
            type: 'timepicker',
            width: 2,
          },
        ]
      },
      {
        children: [
          {
            controlName: 'employees',
            label: 'actionsLog.filter.employees.title',
            placeholder: 'actionsLog.filter.employees.placeholder',
            filterType: 'users',
            type: 'dialogmultiselectwrapper',
            width: 6
          },
          {
            controlName: 'actionsTypes',
            label: 'actionsLog.filter.actionsTypes.title',
            placeholder: 'actionsLog.filter.actionsTypes.placeholder',
            filterType: 'actions',
            type: 'dialogmultiselectwrapper',
            width: 6,
          },
        ]
      },
    ];
  }

  get isFilterValid(): boolean {
    return this.form && this.form.isValid;
  }

  onSearch(): void {
    this.search.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  // onQueryBuilderOpen(): void {
  //   this.queryBuilderOpen.emit();
  // }

  getFilters(): FilterObject {
    const value = this.form.serializedValue;
    // log('formValue', value);
    const endTime = timeToHourMinSec(value.endTime);
    const startTime = timeToHourMinSec(value.startTime);

    const endDate = moment(value.endDate).set(endTime).toISOString();
    const startDate = moment(value.startDate).set(startTime).toISOString();

    const actionsCodes = value.actionsTypes;
    const employeeIds = value.employees;

    return FilterObject
      .create()
      .and()
      .addFilter(
        FilterObject.create()
          .setName('createDateTime')
          .betweenOperator()
          .setValues([ startDate, endDate ])
      )
      .addFilter(
        FilterObject.create()
          .setName('typeCode')
          .inOperator()
          .setValues(actionsCodes)
      )
      .addFilter(
        FilterObject.create()
          .setName('userId')
          .inOperator()
          .setValues(employeeIds)
      );
  }
}
