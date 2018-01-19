import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { IGridColumn, IRenderer } from '@app/shared/components/grid/grid.interface';
import {
  IDynamicFormControl,
  IDynamicFormSelectControl,
  IDynamicFormDateControl,
  IDynamicFormTextControl
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployee } from '../actions-log.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from './actions-log-filter.interface';
import { IDictionaryItem } from '../../dictionaries/dictionaries.interface';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { MultiSelectComponent } from '@app/shared/components/form/multi-select/multi-select.component';

import { DataService } from '@app/core/data/data.service';
import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { GridService } from '@app/shared/components/grid/grid.service';
import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { toFullName, timeToHourMinSec } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-actions-log-filter',
  styleUrls: ['./actions-log-filter.component.scss'],
  templateUrl: './actions-log-filter.component.html',
})
export class ActionsLogFilterComponent extends DynamicFormComponent implements OnInit {
  @Input() employeesRows: Observable<any>;
  @Input() actionTypesRows: Observable<any>;
  @Output() export = new EventEmitter<void>();
  @Output() search = new EventEmitter<void>();
  @Output() queryBuilderOpen = new EventEmitter<void>();
  @ViewChild('employees') employeesComponent: MultiSelectComponent;
  @ViewChild('actionTypes') actionTypesComponent: MultiSelectComponent;

  employeesControl: IDynamicFormSelectControl;
  inactiveEmployeesControl: IDynamicFormTextControl;
  actionTypesControl: IDynamicFormSelectControl;
  startDateControl: IDynamicFormDateControl;
  endDateControl: IDynamicFormDateControl;
  startTimeControl: IDynamicFormTextControl;
  endTimeControl: IDynamicFormTextControl;

  employeesColumnsFrom: IGridColumn[] = [
    { prop: 'id', width: 50 },
    { prop: 'fullName', width: 150 },
    { prop: 'position', width: 150 },
    { prop: 'organization' },
  ];

  employeesColumnsTo: IGridColumn[] = [
    { prop: 'fullName'}
  ];

  actionsTypesColumnsFrom: IGridColumn[] = [
    { prop: 'code', maxWidth: 70 },
    { prop: 'name' },
  ];

  actionsTypesColumnsTo: IGridColumn[] = [
    { prop: 'name'}
  ];

  renderers: IRenderer = {
    fullName: toFullName
  };

  toolbarActions: IToolbarAction[] = [
    { text: 'default.buttons.search', type: ToolbarActionTypeEnum.SEARCH, hasLabel: true },
  ];

  private _dialog: string;

  get employeesRowsFilter(): Function {
    return this.value[this.inactiveEmployeesControl.controlName]
      ? () => true
      : (record: IEmployee) => !record.isInactive;
  }

  constructor(
    cdRef: ChangeDetectorRef,
    dataService: DataService,
    formBuilder: FormBuilder,
    gridService: GridService,
    lookupService: LookupService,
    userDictionariesService: UserDictionariesService,
    valueConverterService: ValueConverterService,
  ) {
    super(cdRef, dataService, formBuilder, lookupService, valueConverterService, userDictionariesService);
    this.employeesColumnsFrom = gridService.setRenderers(this.employeesColumnsFrom, this.renderers);
    this.employeesColumnsTo = gridService.setRenderers(this.employeesColumnsTo, this.renderers);
  }

  ngOnInit(): void {
    this.controls = [
      this.employeesControl = {
        controlName: 'employees',
        label: 'actionsLog.filter.employees.title',
        placeholder: 'actionsLog.filter.employees.placeholder',
        required: true,
        type: 'multiselect',
      },
      this.inactiveEmployeesControl = {
        controlName: 'blockingEmployees',
        label: 'actionsLog.filter.employees.inactive',
        type: 'checkbox',
      },
      this.actionTypesControl = {
        controlName: 'actionsTypes',
        label: 'actionsLog.filter.actionsTypes.title',
        placeholder: 'actionsLog.filter.actionsTypes.placeholder',
        required: true,
        type: 'multiselect',
      },
      this.startDateControl = {
        controlName: 'startDate',
        label: 'default.dateTimeRange.from',
        required: true,
        type: 'datepicker',
      },
      this.startTimeControl = {
        controlName: 'startTime',
        label: null,
        required: true,
        type: 'text',
      },
      this.endDateControl = {
        controlName: 'endDate',
        label: 'default.dateTimeRange.to',
        required: true,
        type: 'datepicker',
      },
      this.endTimeControl = {
        controlName: 'endTime',
        label: null,
        required: true,
        type: 'text',
      },
    ];

    this.data = {
      [this.startTimeControl.controlName]: '00:00:00',
      [this.endTimeControl.controlName]: '23:59:59',
      [this.startDateControl.controlName]: moment().startOf('month').toDate(),
      [this.endDateControl.controlName]: moment().endOf('month').toDate()
    };

    super.ngOnInit();
  }

  get selectedEmployees(): string {
    if (Array.isArray(this.value.employees)) {
      return (this.value.employees as IEmployee[] || []).map(record => toFullName(record)).join(', ');
    }
    return '';
  }

  get selectedActionTypes(): string {
    if (Array.isArray(this.value.actionsTypes)) {
      return (this.value.actionsTypes as IDictionaryItem[] || []).map(record => record.name).join(', ');
    }
    return '';
  }

  isDialog(type: string): boolean {
    return this._dialog === type;
  }

  setDialog(type: string = null): void {
    this._dialog = type;
  }

  onSetEmployees(): void {
    this.employeesComponent.syncChanges();
    this.setDialog();
  }

  onSetActionTypes(): void {
    this.actionTypesComponent.syncChanges();
    this.setDialog();
  }

  onSearch(): void {
    this.search.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  onQueryBuilderOpen(): void {
    this.queryBuilderOpen.emit();
  }

  getFilters(): FilterObject {
    const endTime = timeToHourMinSec(this.value.endTime);
    const startTime = timeToHourMinSec(this.value.startTime);

    const endDate = moment(this.value.endDate).set(endTime).toISOString();
    const startDate = moment(this.value.startDate).set(startTime).toISOString();

    const actionsTypes = (this.value.actionsTypes as IDictionaryItem[] || []).map(record => record.code);
    const employees = (this.value.employees as IEmployee[] || []).map(record => record.id);

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
          .setValues(actionsTypes)
      )
      .addFilter(
        FilterObject.create()
          .setName('userId')
          .inOperator()
          .setValues(employees)
      );
  }
}
