import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IColumn, IFilterType, IOperator } from '../qbuilder2.interface';
import { IOption } from '../../../../core/converter/value/value-converter.interface';

import { FilterOperatorType, FilterObject } from '../../grid2/filter/grid-filter';

@Component({
  selector: 'app-qbuilder2-condition',
  templateUrl: './qbuilder2-condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QBuilder2ConditionComponent {
  @Input() columns: Array<IColumn>;
  @Input() filter: FilterObject;

  @Output() onRemove = new EventEmitter<void>();

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

  get column(): IColumn {
    return this.columns.find(c => c.colId === this.filter.name);
  }

  get filterType(): IFilterType {
    return this.column ? this.column.filter as IFilterType : 'text';
  }

  get operator(): FilterOperatorType {
    return this.filter.operator;
  }

  get nControls(): number {
    if (this.operator === 'IN' || this.operator === 'NOT IN') { return -1; }
    if (this.operator === 'EMPTY' || this.operator === 'NOT EMPTY') { return 0; }
    if (this.operator === 'BETWEEN' || this.operator === 'NOT BETWEEN') { return 2; }
    return 1;
  }

  get operators(): Array<IOperator> {
    return this._operators.filter(operator => operator.filters === undefined || operator.filters.includes(this.filterType));
  }

  get fieldOptions(): Array<IOption> {
    return this.columns.map(column => ({
      value: column.colId,
      label: column.name
    }));
  }

  remove(): void {
    this.onRemove.emit();
  }
}