import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IOption } from '../../../../../core/converter/value-converter.interface';

import { DropdownDirective } from '../../../dropdown/dropdown.directive';

@Component({
  selector: 'app-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: [ './single-select.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSelectComponent implements ControlValueAccessor {
  @Input() nullable = false;
  @Input() options: IOption[] = [];
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _isDisabled = false;
  private _value: number | string = null;

  constructor(private cdRef: ChangeDetectorRef) {}

  get label(): string {
    const option = (this.options || []).find(o => o.value === this._value);
    return option ? option.label : null;
  }

  getId = (option: IOption) => option.value;
  getName = (option: IOption) => option.label;

  onSelect(item: IOption): void {
    this.value = item.value;
    this.propagateChange(this._value);
    this.dropdown.close();
  }

  writeValue(value: number | string): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }

  private set value(value: number | string) {
    this._value = value;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
}
