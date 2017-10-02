import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ISegmentedInputValue, ISegmentedInputOption } from './segmented-input.interface';

import { DropdownComponent } from '../../dropdown/dropdown.component';

@Component({
  selector: 'app-segmented-input',
  templateUrl: './segmented-input.component.html',
  styleUrls: [ './segmented-input.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SegmentedInputComponent implements ControlValueAccessor {
  @Input() options: ISegmentedInputOption[];

  @ViewChild(DropdownComponent) dropdown: DropdownComponent;

  private _value: ISegmentedInputValue;

  constructor(private cdRef: ChangeDetectorRef) {}

  writeValue(value: ISegmentedInputValue): void {
    this._value = {
      ...value,
      name: value.name || this.options[0].name
    }
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  get label(): string {
    const option = this.options.find(o => o.name === this._value.name);
    return option ? option.label : '';
  }

  get value(): string {
    return this._value.value;
  }

  onOptionSelect(option: ISegmentedInputOption): void {
    this._value = {
      ...(this._value || { value: '' }),
      name: option.name
    }
    this.propagateChange(this._value);
    this.dropdown.close();
  }

  private propagateChange: Function = () => {};
}
