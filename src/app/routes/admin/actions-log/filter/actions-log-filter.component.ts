import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IActionsLogFilterRequest } from './actions-log-filter.interface';
import { IEmployee } from '../actions-log.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';
import { IDictionaryItem } from '../../../../core/dictionaries/dictionaries.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';

import { toFullName } from '../actions-log.component';
import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { MultiSelectComponent } from '../../../../shared/components/form/multi-select/multi-select.component';
import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-actions-log-filter',
  styleUrls: ['./actions-log-filter.component.scss'],
  templateUrl: './actions-log-filter.component.html',
})
export class ActionsLogFilterComponent extends DynamicFormComponent implements OnInit {

  @Input() employeesRows;
  @Input() actionTypesRows;
  @Output() search: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('employees') employeesComponent: MultiSelectComponent;
  @ViewChild('actionTypes') actionTypesComponent: MultiSelectComponent;

  employeesControl: IDynamicFormControl;
  blockingEmployeesControl: IDynamicFormControl;
  actionTypesControl: IDynamicFormControl;
  startDateControl: IDynamicFormControl;
  endDateControl: IDynamicFormControl;
  startTimeControl: IDynamicFormControl;
  endTimeControl: IDynamicFormControl;

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
    { text: 'toolbar.action.search', type: ToolbarActionTypeEnum.SEARCH, hasLabel: true },
  ];

  private _action: string;

  actionTypesEqualsFn = (o1: IDictionaryItem, o2: IDictionaryItem) => o1.code === o2.code;

  employeesRowsFilter: Function = (record: IEmployee) => {
    const blockingEmployees: boolean = this.value[this.blockingEmployeesControl.controlName];
    return blockingEmployees || !record.isBlocked;
  }

  constructor(
    formBuilder: FormBuilder,
    gridService: GridService,
    private valueConverterService: ValueConverterService,
  ) {
    super(formBuilder);
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
      this.blockingEmployeesControl = {
        controlName: 'blockingEmployees',
        label: 'actionsLog.filter.employees.blocking',
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
        label: 'default.dateTimeRage.from',
        required: true,
        type: 'datepicker',
      },
      this.startTimeControl = {
        controlName: 'startTime',
        required: true,
        type: 'text',
      } as IDynamicFormControl,
      this.endDateControl = {
        controlName: 'endDate',
        label: 'default.dateTimeRage.to',
        required: true,
        type: 'datepicker',
      },
      this.endTimeControl = {
        controlName: 'endTime',
        required: true,
        type: 'text',
      } as IDynamicFormControl,
    ];

    this.data = {
      [this.startTimeControl.controlName]: '00:00:00',
      [this.endTimeControl.controlName]: '23:59:59',
      [this.startDateControl.controlName]: moment(Date.now()).startOf('month').toDate(),
      [this.endDateControl.controlName]: moment(Date.now()).endOf('month').toDate()
    };

    super.ngOnInit();
  }

  get selectedEmployees(): string {
    if (Array.isArray(this.value.employees)) {
      return (this.value.employees as IEmployee[] || []).map((record: IEmployee) => toFullName(record)).join(', ');
    }
    return '';
  }

  get selectedActionTypes(): string {
    if (Array.isArray(this.value.actionsTypes)) {
      return (this.value.actionsTypes as IDictionaryItem[] || []).map((record: IDictionaryItem) => record.name).join(', ');
    }
    return '';
  }

  get isEmployeesBeingSelected(): boolean {
    return this._action === 'employees';
  }

  get isActionTypesBeingSelected(): boolean {
    return this._action === 'actionTypes';
  }

  onSaveEmployeesChanges(): void {
    this.employeesComponent.syncChanges();
    this.onCloseActionDialog();
  }

  onSaveActionTypesChanges(): void {
    this.actionTypesComponent.syncChanges();
    this.onCloseActionDialog();
  }

  onCloseActionDialog(): void {
    this._action = null;
  }

  onEmployeesSelect(): void {
    this._action = 'employees';
  }

  onActionTypesSelect(): void {
    this._action = 'actionTypes';
  }

  onControlsStatusChanges(): void {
    this.toolbarActions[0].visible = this.form.valid;
  }

  onSearch(): void {
    this.search.emit();
  }

  getFilterValues(): IActionsLogFilterRequest {
    return {
      ...this.value,
      actionsTypes: (this.value.actionsTypes as IDictionaryItem[] || []).map((record: IDictionaryItem) => record.code),
      employees: (this.value.employees as IEmployee[] || []).map((record: IEmployee) => record.id),
      endDate: moment(this.value.endDate).format('DD.MM.YYYY'),
      startDate: moment(this.value.startDate).format('DD.MM.YYYY'),
    };
  }
}
