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

  @Input() set options(opts: ISegmentedInputOption[]) {
    this._options = opts.reduce((acc, o) => ({
      ...acc,
      [o.name]: ''
    }), {});
    this._originalOptions = opts;
    this.cdRef.markForCheck();
  }

  get options(): ISegmentedInputOption[] {
    return this._originalOptions;
  }

  private defaultMask: ISegmentedInputMask = {
    delimeter: ',',
    maxNumberLength: 7,
    maxNumbers: 8
  };
  private _value: ISegmentedInputValue;
  private _mask: ISegmentedInputMask;
  private _strValue: string;
  private _originalOptions: ISegmentedInputOption[];
  private _options: { [key: string]: any };
  value: string;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  writeValue(value: ISegmentedInputValue): void {
    const name = value && value.name || this.options[0].name;
    this._value = { ...value, name };
    const option = this.options.find(o => o.name === name);
    if (option && option.mask) {
      this.maskedArray = option.mask;
    }
    this._options[this._value.name] = this._value.value;
    this.value = this.toViewValue(this._value.value);
    this._strValue = this.value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
  }

  set maskedArray(mask: ISegmentedInputMask) {
    this._mask = mask ? Object.assign(this.defaultMask, mask) : null;
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
      ...({ value: this._options[option.name] || '' }),
      name: option.name
    };
    this.maskedArray = option.mask;
    this.value = this.toViewValue(this._value.value);
    this._strValue = this.value;
    this.propagateChange(this._value);
    this.dropdown.close();
  }

  onChange(value: string): void {
    this._value = {
      ...this._value,
      value: this.getModelValue(value),
    };
    this._options[this._value.name] = this._value.value;
    this._strValue = value;
    this.propagateChange(this._value);
  }

  validate(): any {
    if (this._strValue && this._mask && !this._validate(this._strValue)) {
      return { invalid: true };
    }
    return null;
  }

  private _validate(value: string): boolean {
    const arr = value.replace(/[\s]+/g, '').split(this._mask.delimeter);
    const re = /[1-9][0-9]*/;
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
    return Array.isArray(value) && this._mask ? value.join(this._mask.delimeter + ' ') : value;
  }

  private propagateChange: Function = () => {};
}
