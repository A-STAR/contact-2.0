import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { ISegmentedInputValue, ISegmentedInputOption, ISegmentedInputMask } from './segmented-input.interface';

import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-segmented-input',
  templateUrl: './segmented-input.component.html',
  styleUrls: [ './segmented-input.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SegmentedInputComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SegmentedInputComponent implements ControlValueAccessor {
  @ViewChild(DropdownComponent) dropdown: DropdownComponent;

  @Input() options: ISegmentedInputOption[];

  private defaultMask: ISegmentedInputMask = {
    delimeter: ',',
    maxNumberLength: 5,
    maxNumbers: 6
  };
  private _value: ISegmentedInputValue;
  private _mask: ISegmentedInputMask;
  private regex: RegExp;
  private _strValue: string;
  value: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  writeValue(value: ISegmentedInputValue): void {
    const name = value && value.name || this.options[0].name;
    this._value = { ...value, name };
    this.value = this.toViewValue(this._value.value);
    this.maskedArray = this.options[0].mask;
    this._strValue = this.value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  set maskedArray(mask: ISegmentedInputMask) {
    this._mask = Object.assign(this.defaultMask, mask);
  }

  get maskedArray(): ISegmentedInputMask {
    return this._mask;
  }

  get label(): string {
    const option = this.options.find(o => o.name === this._value.name);
    return option ? option.label : '';
  }

  onOptionSelect(option: ISegmentedInputOption): void {
    this._value = {
      ...(this._value || { value: '' }),
      name: option.name
    };
    this.maskedArray = option.mask;
    this.value = this._value.value;
    this.propagateChange(this._value);
    this.dropdown.close();
  }

  onChange(value: string): void {
    this._value = {
      ...this._value,
      value: this.getModelValue(value),
    };
    this._strValue = value;
    this.propagateChange(this._value);
  }

  validate(): any {
    if (this._strValue && this.regex && !this._validate(this._strValue)) {
      return { invalid: true };
    }
    return null;
  }

  private _validate(value: string): boolean {
    const arr = value.split(this._mask.delimeter + ' ');
    const re = /[1-9][0-9]*/g;
    return arr.length <= this._mask.maxNumbers &&
      arr.every(p => re.test(p) && p.length <= this._mask.maxNumberLength);
  }

  private getModelValue(value: string): any {
    if (this.maskedArray) {
      return value.replace(/[\s]+/g, '').split(this.maskedArray.delimeter)
        .filter(v => v !== '').map(Number);
    }
    return value;
  }

  private toViewValue(value: any): string {
    return typeof value === 'number' || typeof value === 'string' ? value : value.join(this._mask.delimeter + ' ');
  }

  private propagateChange: Function = () => {};
}
