import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

import { FilterObject } from '../../grid2/filter/grid2-filter';

@Component({
  selector: 'app-qbuilder2-condition',
  templateUrl: './qbuilder2-condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QBuilder2ConditionComponent {
  @Input() columns: Array<ColDef>;
  @Input() filter: FilterObject;

  @Output() onRemove = new EventEmitter<void>();

  private _operators: Array<any> = [
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

  private filterType: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
  ) {}

  get operators(): Array<any> {
    return this._operators.filter(operator => operator.filters === undefined || operator.filters.includes(this.filterType));
  }

  get fieldOptions(): Array<any> {
    return this.columns.map(column => ({
      value: column.field,
      label: column.headerName
    }));
  }

  onFieldChange(event: any): void {
    const column = this.columns.find(c => c.field === event.target.value);
    this.filterType = column.filter;
    this.changeDetectorRef.markForCheck();
  }

  toDate(date: string): Date {
    return this.valueConverterService.fromISO(date);
  }

  remove(): void {
    this.onRemove.emit();
  }
}
