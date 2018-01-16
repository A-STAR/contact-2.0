import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IMultiLanguageOption } from './multi-language.interface';

@Component({
  selector: 'app-multilanguage-input',
  templateUrl: './multi-language.component.html',
  styleUrls: [ './multi-language.component.scss' ],
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
  private _langOptions: IMultiLanguageOption[] = [];
  private _selectedId: number;

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() controlDisabled = false;

  @Input('langOptions')
  set langOptions(options: IMultiLanguageOption[]) {
    this._langOptions = options.map(option => ({ ...option, active: !!option.isMain }));
    if (options.length > 0) {
      this._selectedId = options.length ? 0 : null;
    }
    this.cdRef.markForCheck();
  }

  get langOptions(): IMultiLanguageOption[] {
    return this._langOptions;
  }

  writeValue(values: IMultiLanguageOption[]): void {
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  get model(): string {
    const item = (this.langOptions || []).find((v, i) => i === this._selectedId);
    return item && item.value || null;
  }

  onLanguageChange(option: IMultiLanguageOption): void {
    this._selectedId = this.langOptions.findIndex(v => v.languageId === option.languageId);
    this.cdRef.markForCheck();
  }

  onValueChange(value: string): void {
    const item = (this.langOptions || []).find((v, i) => i === this._selectedId);
    if (item) {
      item.value = value;
      item.isUpdated = true;
      this.propagateChange(this.langOptions);
    }
  }

  onClear(): void {
    this.onValueChange(null);
  }

  private propagateChange: Function = () => {};
}
