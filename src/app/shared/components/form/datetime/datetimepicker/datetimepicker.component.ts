import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

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

  // TODO(d.maltsev): get format from locale
  private format = 'mm/dd/yyyy HH:MM';

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get value(): Date {
    return this._value;
  }

  get mask(): any {
    return {
      keepCharPositions: true,
      mask: this.createMaskFromFormat(this.format),
      pipe: createAutoCorrectedDatePipe(this.format),
    };
  }

  writeValue(value: Date): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    // this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // this.propagateTouch = fn;
  }

  onWheel(event: WheelEvent): void {
    const target = event.target as HTMLInputElement;
    const delta = Math.sign(event.deltaY);
    const start = target.selectionStart;
    console.log(delta, start);
  }

  private createMaskFromFormat(format: string): any[] {
    // Do NOT use `.split('')` here!
    // See https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript
    return Array.from(this.format).map(c => c.match(/[a-z]/i) ? /\d/ : c);
  }

  // private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
