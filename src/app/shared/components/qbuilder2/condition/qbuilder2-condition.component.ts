import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid';

import { IFilterType, IOperator } from '../qbuilder2.interface';
import { IOption } from '../../../../core/converter/value/value-converter.interface';

import { FilterOperatorType, FilterObject } from '../../grid2/filter/grid-filter';

@Component({
  selector: 'app-qbuilder2-condition',
  templateUrl: './qbuilder2-condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QBuilder2ConditionComponent {
  @Input() columns: Array<ColDef>;
  @Input() filter: FilterObject;

  @Output() onRemove = new EventEmitter<void>();

  controlType: IFilterType;
  operator: FilterOperatorType;

  private _operators: Array<IOperator> = [
    { name: '==' },
    { name: '!=' },
    { name: '>=' },
    { name: '<=' },
    { name: '>' },
    { name: '<' },
    { name: 'EMPTY' },
    { name: 'NOT EMPTY' },
    { name: 'IN' },
    { name: 'NOT IN' },
    { name: 'BETWEEN' },
    { name: 'NOT BETWEEN' },
    { name: 'LIKE', filters: [ 'text' ] },
    { name: 'NOT LIKE', filters: [ 'text' ] },
  ];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  get nControls(): number {
    if (this.operator === 'IN' || this.operator === 'NOT IN') { return 0; }
    if (this.operator === 'BETWEEN' || this.operator === 'NOT BETWEEN') { return 2; }
    return 1;
  }

  get operators(): Array<IOperator> {
    return this._operators.filter(operator => operator.filters === undefined || operator.filters.includes(this.controlType));
  }

  get fieldOptions(): Array<IOption> {
    return this.columns.map(column => ({
      value: column.field,
      label: column.headerName
    }));
  }

  onFieldChange(event: Event): void {
    const column = this.columns.find(c => c.field === (event.target as HTMLInputElement).value);
    this.controlType = column.filter as IFilterType;
    this.changeDetectorRef.markForCheck();
  }

  onOperatorChange(event: Event): void {
    this.operator = (event.target as HTMLInputElement).value as FilterOperatorType;
    this.changeDetectorRef.markForCheck();
  }

  remove(): void {
    this.onRemove.emit();
  }
}
