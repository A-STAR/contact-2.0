import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColDef } from 'ag-grid';

import { ControlTypes } from '../../form/dynamic-form/dynamic-form-control.interface';

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
  @Input() controlType: ControlTypes;
  @Input() column: ColDef;

  value: Array<Date | string | number> = [];

  private propagateChange: Function = () => {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { nControls } = changes;
    if (this.value.length && nControls && nControls.currentValue) {
      this.value = this.value.concat([ null, null ]).slice(0, nControls.currentValue);
      this.propagateChange(this.value);
    }
  }

  get displayAsArray(): boolean {
    return this.nControls !== 1;
  }

  get displayButtons(): boolean {
    return this.nControls === 0;
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

  toDate(date: string): Date {
    return this.valueConverterService.fromISO(date);
  }

  onValueChange(i: number, event: Event): void {
    this.updateValue(i, (event.target as HTMLInputElement).value);
  }

  onSetValueChange(i: number, options: Array<{ value: string }>): void {
    this.updateValue(i, options[0].value);
  }

  onDateValueChange(i: number, date: Date): void {
    this.updateValue(i, this.valueConverterService.toISO(date));
  }

  private updateValue(i: number, value: Date | string | number): void {
    this.value[i] = value;
    this.propagateChange(this.value);
  }
}
