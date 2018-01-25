import { Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true
    }
  ],
})
export class TimeComponent implements ControlValueAccessor {
  @ViewChild('input') input: HTMLInputElement;

  @Input() name: string;
  @Input() value = '00:00:00';

  mask = {
    keepCharPositions: true,
    mask: [/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/, ':', /[0-5]/, /[0-9]/],
  };

  cursorPositionToIndex = {
    0: 0,
    1: 0,
    2: 0,
    3: 1,
    4: 1,
    5: 1,
    6: 2,
    7: 2,
    8: 2,
  };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    // this.onTouched = fn;
  }

  onModelChange(value: string): void {
    this.onChange(value);
  }

  onMouseWheel(event: WheelEvent): void {
    /**
     * Mouse positions will be translated to:
     * [0-2]: hours (index: 0)
     * [3-5]: minutes (index: 1)
     * [6-8]: seconds (index: 2)
     */
    const input = <HTMLInputElement>event.target;
    const delta = event.deltaY < 0 ? 1 : -1;
    const value = input.value;
    const start = input.selectionStart;
    const index = this.cursorPositionToIndex[start];
    const [ hours, mins, secs ] = value.split(':')
      .map(val => val.replace(/[^\d]/, ''))
      .map(val => +val)
      .map((val, i) => i === index ? val + delta : val);
    const newValue = [
        this.validateHours(hours),
        this.validateMinSec(mins),
        this.validateMinSec(secs),
      ]
      .map(val => this.padStart(2, '0', String(val)))
      .join(':');

    input.value = newValue;
    input.setSelectionRange(start, start);
    this.onChange(newValue);
  }

  private padStart(targetLength: number, padString: string = '', value: string): string {
    const repeat = targetLength - value.length;
    return repeat ? padString.repeat(repeat) + value : value;
  }

  private validateHours(hours: number): number {
    return hours > 23
      ? 23
      : hours < 0
        ? 0
        : hours;
  }

  private validateMinSec(val: number): number {
    return val > 59
      ? 59
      : val < 0
        ? 0
        : val;
  }

  private onChange: Function = () => {};
  // private onTouched: Function = () => {};
}
