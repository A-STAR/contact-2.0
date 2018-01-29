import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true,
    }
  ],
  selector: 'app-datetimepicker',
  styleUrls: [ './datetimepicker.component.scss' ],
  templateUrl: './datetimepicker.component.html'
})
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() minDateTime: Date;
  @Input() maxDateTime: Date;

  private _value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get value(): Date {
    return this._value;
  }

  writeValue(value: Date): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
