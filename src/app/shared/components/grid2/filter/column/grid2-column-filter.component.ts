import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as R from 'ramda';

import { ControlTypes, IDynamicFormControl } from '../../../form/dynamic-form/dynamic-form-control.interface';
import { IGrid2ColumnFilterData } from './grid2-column-filter.interface';
import {
  FilteringConditionType,
  FilteringOperators,
  FilteringOperatorType,
  FilterObject
} from '../grid2-filter';

import { DynamicFormComponent } from '../../../form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-grid2-column-filter',
  templateUrl: './grid2-column-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grid2ColumnFilterComponent extends DynamicFormComponent implements OnInit {

  private static DEFAULT_FILTER_CONTROL_TYPE: ControlTypes = 'text';

  @Input() fieldName: string;
  @Input() columnName: string;
  @Input() filterControlType: ControlTypes;
  @Input() filter: FilterObject;

  @Output() action: EventEmitter<FilterObject> = new EventEmitter<FilterObject>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  condition: FilteringConditionType = 'AND';
  firstValueControl: IDynamicFormControl;
  secondValueControl: IDynamicFormControl;
  firstSelectionControl: IDynamicFormControl;
  secondSelectionControl: IDynamicFormControl;

  conditionItems = [
    { label: 'default.filter.equal', value: FilteringOperators.EQUAL },
    { label: 'default.filter.notEqual', value: FilteringOperators.NOT_EQUAL },
    { label: 'default.filter.empty', value: FilteringOperators.EMPTY }
  ];

  constructor(formBuilder: FormBuilder) {
    super(formBuilder);
  }

  ngOnInit(): void {
    this.controls = [
      this.firstSelectionControl = {
        label: this.columnName,
        controlName: 'firstSelectionValue',
        type: 'select',
        options: this.conditionItems,
        readonly: true
      },
      this.secondSelectionControl = {
        label: this.columnName,
        controlName: 'secondSelectionValue',
        type: 'select',
        options: this.conditionItems,
        readonly: true
      },
      this.firstValueControl = {
        label: 'default.filter.value',
        controlName: 'firstValue',
        type: this.filterControlType || Grid2ColumnFilterComponent.DEFAULT_FILTER_CONTROL_TYPE,
      },
      this.secondValueControl = {
        label: 'default.filter.value',
        controlName: 'secondValue',
        type: this.filterControlType || Grid2ColumnFilterComponent.DEFAULT_FILTER_CONTROL_TYPE,
      }
    ];

    const data: IGrid2ColumnFilterData = (this.data = (this.data || {})) as IGrid2ColumnFilterData;

    if (this.filter) {
      this.condition = this.filter.condition;

      if (this.filter.hasFilter()) {
        const firstFilter: FilterObject = this.filter.filters[0] as FilterObject;
        const secondFilter: FilterObject = this.filter.filters[1] as FilterObject;
        if (firstFilter) {
          data.firstValue = firstFilter.value;
          data.firstSelectionValue = firstFilter.operator;
        }
        if (secondFilter) {
          data.secondValue = secondFilter.value;
          data.secondSelectionValue = secondFilter.operator;
        }
      }
    }
    if (R.isNil(data.firstSelectionValue)) {
      data.firstSelectionValue = FilteringOperators.EQUAL;
    }

    super.ngOnInit();
  }

  onSaveFilterChanges(): void {
    const data: IGrid2ColumnFilterData = this.form.value;

    let filter: FilterObject = null;
    if (!R.isNil(data.firstValue) && !R.isEmpty(data.firstValue) && !R.isNil(this._firstOperator)) {
      filter = this.makeConditionFilter()
        .addFilter(
          this.makeFieldFilter()
            .setOperator(this._firstOperator)
            .setValue(data.firstValue)
        );
    }
    if (!R.isNil(data.secondValue) && !R.isEmpty(data.secondValue) && !R.isNil(this._secondOperator)) {
      filter = (filter || this.makeConditionFilter())
        .addFilter(
          this.makeFieldFilter()
            .setOperator(this._secondOperator)
            .setValue(data.secondValue)
        );
    }

    this.action.emit(filter);
  }

  onCloseFilterDialog(): void {
    this.cancel.emit();
  }

  private get _firstOperator(): FilteringOperatorType {
    const data: IGrid2ColumnFilterData = this.form.value;

    if (Array.isArray(data.firstSelectionValue)) {
      return data.firstSelectionValue[0].value;
    } else {
      return data.firstSelectionValue;
    }
  }

  private get _secondOperator(): FilteringOperatorType {
    const data: IGrid2ColumnFilterData = this.form.value;

    if (Array.isArray(data.secondSelectionValue)) {
      return data.secondSelectionValue[0].value;
    } else {
      return data.secondSelectionValue;
    }
  }

  private makeConditionFilter(): FilterObject {
    return FilterObject.create()
      .setCondition(this.condition);
  }

  private makeFieldFilter(): FilterObject {
    return FilterObject.create()
      .setName(this.fieldName);
  }
}
