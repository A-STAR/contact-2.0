import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IMultiLanguageOption } from './multi-language.interface';

@Component({
  selector: 'app-multilanguage-input',
  templateUrl: './multi-language.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLanguageComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiLanguageComponent implements ControlValueAccessor {
  private _options: IMultiLanguageOption[] = [];
  private _selectedId: number;

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() controlDisabled = false;

  @Input('options')
  set options(options: IMultiLanguageOption[]) {
    this._options = options.map(option => ({ ...option, active: !!option.isMain }));
    if (options.length > 0) {
      this._selectedId = options.length ? 0 : null;
    }
    this.cdRef.markForCheck();
  }

  get options(): IMultiLanguageOption[] {
    return this._options;
  }

  writeValue(values: IMultiLanguageOption[]): void {
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  get displayValue(): string {
    const item = (this.options || []).find((v, i) => i === this._selectedId);
    return item && item.value || '';
  }

  onLanguageChange(option: IMultiLanguageOption): void {
    this._selectedId = this.options.findIndex(v => v.languageId === option.languageId);
    this.cdRef.markForCheck();
  }

  onValueChange(value: string): void {
    const item = (this.options || []).find((v, i) => i === this._selectedId);
    if (item) {
      item.value = value;
      item.isUpdated = true;
      this.propagateChange(this.options);
    }
  }

  private propagateChange: Function = () => {};
}
