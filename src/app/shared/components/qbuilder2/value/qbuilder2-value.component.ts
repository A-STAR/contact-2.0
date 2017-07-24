import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColDef } from 'ag-grid';

import { IFilterType } from '../qbuilder2.interface';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-qbuilder2-value',
  templateUrl: './qbuilder2-value.component.html',
  styleUrls: [ './qbuilder2-value.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QBuilder2ValueComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QBuilder2ValueComponent implements ControlValueAccessor, OnChanges {

  // nControls = 0 for any number
  @Input() nControls: number;
  @Input() column: ColDef;

  value: Array<Date | string | number> = [];

  private propagateChange: Function = () => {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { column, nControls } = changes;

    if (this.value.length && nControls && nControls.currentValue) {
      this.value = this.value.concat([ null, null ]).slice(0, nControls.currentValue);
    }

    if (column) {
      this.value = this.value.fill(null);
    }

    this.propagateChange(this.value);
  }

  get displayAsArray(): boolean {
    return this.nControls !== 1;
  }

  get displayButtons(): boolean {
    return this.nControls === 0;
  }

  get filterType(): IFilterType {
    return this.column ? this.column.filter as IFilterType : 'text';
  }

  get options(): Array<any> {
    return (this.column.filterParams.values || []).map((label, value) => ({ label, value }));
  }

  writeValue(value: Array<Date | string | number>): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  addValue(): void {
    this.value.push(null);
  }

  removeValue(): void {
    this.value.pop();
  }

  onValueChange(event: Event, i: number): void {
    this.updateValue((event.target as HTMLInputElement).value, i);
  }

  onSetValueChange(options: Array<{ value: string }>, i: number): void {
    this.updateValue(options[0].value, i);
  }

  onDateValueChange(date: Date, i: number): void {
    this.updateValue(this.valueConverterService.toISO(date), i);
  }

  toDate(date: string): Date {
    return this.valueConverterService.fromISO(date);
  }

  trackByIndex(i: number): number {
    return i;
  }

  private updateValue(value: Date | string | number, i: number): void {
    this.value[i] = value;
    this.propagateChange(this.value);
  }
}
