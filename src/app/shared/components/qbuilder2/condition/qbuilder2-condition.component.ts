import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IFilterType, IOperator } from '../qbuilder2.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';
import { IAGridColumn } from '../../grid2/grid2.interface';

import { FilterOperatorType, FilterObject } from '../../grid2/filter/grid-filter';

@Component({
  selector: 'app-qbuilder2-condition',
  templateUrl: './qbuilder2-condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QBuilder2ConditionComponent {
  @Input() columns: Array<IAGridColumn>;
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

  get column(): IAGridColumn {
    return this.columns.find(c => c.colId === this.filter.name);
  }

  get filterType(): IFilterType {
    return this.column ? this.column.filter as IFilterType : 'text';
  }

  get operator(): FilterOperatorType {
    return this.filter.operator;
  }

  get nControls(): number {
    if (['IN', 'NOT IN'].includes(this.operator)) { return -1; }
    if (['EMPTY', 'NOT EMPTY'].includes(this.operator)) { return 0; }
    if (['BETWEEN', 'NOT BETWEEN'].includes(this.operator)) { return 2; }
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
