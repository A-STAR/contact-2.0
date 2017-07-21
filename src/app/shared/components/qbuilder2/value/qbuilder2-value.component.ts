import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  @Input() nControls = 1;
  @Input() controlType = 'text' as ControlTypes;

  value: Array<Date | string | number> = [];

  private propagateChange: Function = () => {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private valueConverterService: ValueConverterService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // TODO(d.maltsev): find out why parent doesn't update immediately
    const { nControls } = changes;
    if (this.value.length && nControls && nControls.currentValue) {
      this.value = this.value.concat(null).slice(0, nControls.currentValue);
      this.propagateChange(this.value);
    }
  }

  get displayAsArray(): boolean {
    return this.nControls !== 1;
  }

  get displayButtons(): boolean {
    return this.nControls === 0;
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

  onValueChange(event: Event, i: number): void {
    this.value[i] = (event.target as HTMLInputElement).value;
    this.propagateChange(this.value);
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
}
