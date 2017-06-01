import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { IGridColumn, IRenderer } from '../../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IActionsLogFilterRequest } from './actions-log-filter.interface';
import { IEmployee, IActionType } from '../actions-log.interface';
import { IToolbarAction, ToolbarActionTypeEnum } from '../../../../shared/components/toolbar/toolbar.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { MultiSelectComponent } from '../../../../shared/components/form/multi-select/multi-select.component';

export const toFullName = (employee: IEmployee) => {
  return [employee.lastName, employee.firstName, employee.middleName].filter((part: string) => !!part).join('');
};

@Component({
  selector: 'app-actions-log-filter',
  templateUrl: './actions-log-filter.component.html',
  styleUrls: ['./actions-log-filter.component.scss']
})
export class ActionsLogFilterComponent extends DynamicFormComponent implements OnInit {

  @Input() employeesRows;
  @Input() actionTypesRows;
  @Output() search: EventEmitter<IActionsLogFilterRequest> = new EventEmitter<IActionsLogFilterRequest>();
  @ViewChild('employees') employeesComponent: MultiSelectComponent;
  @ViewChild('actionTypes') actionTypesComponent: MultiSelectComponent;

  employeesControl: IDynamicFormControl;
  actionTypesControl: IDynamicFormControl;
  startDateControl: IDynamicFormControl;
  endDateControl: IDynamicFormControl;
  startTimeControl: IDynamicFormControl;
  endTimeControl: IDynamicFormControl;

  actionTypesEqualsFn = (o1: IActionType, o2: IActionType) => o1.code === o2.code;

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

  constructor(
    formBuilder: FormBuilder,
    gridService: GridService
  ) {
    super(formBuilder);
    this.employeesColumnsFrom = gridService.setRenderers(this.employeesColumnsFrom, this.renderers);
    this.employeesColumnsTo = gridService.setRenderers(this.employeesColumnsTo, this.renderers);
  }

  ngOnInit(): void {
    this.controls = [
      this.employeesControl = {
        label: 'actionsLog.filter.employees.title',
        controlName: 'employees',
        type: 'multiselect',
        required: true
      },
      this.actionTypesControl = {
        label: 'actionsLog.filter.actionsTypes.title',
        controlName: 'actionsTypes',
        type: 'multiselect',
        required: true
      },
      this.startDateControl = {
        label: 'default.dateTimeRage.from',
        controlName: 'startDate',
        type: 'datepicker',
        required: true
      },
      this.startTimeControl = {
        controlName: 'startTime',
        type: 'text',
        required: true
      } as IDynamicFormControl,
      this.endDateControl = {
        label: 'default.dateTimeRage.to',
        controlName: 'endDate',
        type: 'datepicker',
        required: true
      },
      this.endTimeControl = {
        controlName: 'endTime',
        type: 'text',
        required: true
      } as IDynamicFormControl,
    ];

    this.data = {
      [this.startTimeControl.controlName]: '00:00:00',
      [this.endTimeControl.controlName]: '23:59:59',
      [this.startDateControl.controlName]: moment(Date.now()).startOf('month').format('DD.MM.YYYY'),
      [this.endDateControl.controlName]: moment(Date.now()).endOf('month').format('DD.MM.YYYY')
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
      return (this.value.actionsTypes as IActionType[] || []).map((record: IActionType) => record.name).join(', ');
    }
    return '';
  }

  get isEmployeesBeingSelected(): boolean {
    return this._action === 'employees';
  }

  get isActionTypesBeingSelected(): boolean {
    return this._action === 'actionTypes';
  }

  onSaveEmployeesChanges() {
    this.employeesComponent.syncChanges();
    this.onCloseActionDialog();
  }

  onSaveActionTypesChanges() {
    this.actionTypesComponent.syncChanges();
    this.onCloseActionDialog();
  }

  onCloseActionDialog() {
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
    const request: IActionsLogFilterRequest = Object.assign({}, this.value);
    request.employees = (request.employees as IEmployee[] || []).map((record: IEmployee) => record.id);
    request.actionsTypes = (request.actionsTypes as IActionType[] || []).map((record: IActionType) => record.code);
    this.search.emit(request);
  }
}
