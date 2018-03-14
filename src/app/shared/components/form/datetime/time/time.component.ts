import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

type IModifier = 'h' | 'm' | 's';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true,
    },
  ],
  selector: 'app-time',
  styleUrls: [ './time.component.scss' ],
  templateUrl: './time.component.html'
})
export class TimeComponent implements ControlValueAccessor {
  @Input() minTime: Date;
  @Input() maxTime: Date;
  @Input() displaySeconds = true;

  value: Date;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  writeValue(value: Date): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
    // this.propagateTouch = fn;
  }

  getFormattedValue(modifier: IModifier, delta: number): string {
    const format = { h: 'HH', m: 'mm', s: 'ss' }[modifier] || '';
    return moment(this.value || moment()
      .set({ h: 0, m: 0, s: 0, ms: 0 }).toDate())
      .clone().add(delta, modifier).format(format);
  }

  onUp(modifier: IModifier): void {
    this.update(1, modifier);
  }

  onDown(modifier: IModifier): void {
    this.update(-1, modifier);
  }

  onWheel(modifier: IModifier, event: WheelEvent): void {
    const delta = -Math.sign(event.deltaY);
    this.update(delta, modifier);
  }

  private update(delta: number, modifier: IModifier): void {
    this.value = moment(this.value || moment()
      .set({ h: 0, m: 0, s: 0, ms: 0 }).toDate())
      .clone().add(delta, modifier).toDate();
    this.propagateChange(this.value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
