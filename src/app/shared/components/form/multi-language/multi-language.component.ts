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
  isHovering = false;

  private _langOptions: IMultiLanguageOption[] = [];
  private selectedId: number;

  constructor(private cdRef: ChangeDetectorRef) {}

  @Input() controlDisabled = false;

  @Input('langOptions')
  set langOptions(options: IMultiLanguageOption[]) {
    this._langOptions = options.map(option => ({ ...option, active: !!option.isMain }));
    if (options.length > 0) {
      this.selectedId = options.length ? 0 : null;
    }
    this.cdRef.markForCheck();
  }

  get langOptions(): IMultiLanguageOption[] {
    return this._langOptions;
  }

  onHoverChange(e: MouseEvent): void {
    console.log(e.type === 'mouseenter');
    this.isHovering = e.type === 'mouseenter';
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
    const option = (this.langOptions || []).find((v, i) => i === this.selectedId);
    return option ? option.value : null;
  }

  get label(): string {
    const option = (this.langOptions || []).find((v, i) => i === this.selectedId);
    return option ? option.label : '';
  }

  onLanguageChange(option: IMultiLanguageOption): void {
    this.selectedId = this.langOptions.findIndex(v => v.languageId === option.languageId);
    this.cdRef.markForCheck();
  }

  onValueChange(value: string): void {
    const item = (this.langOptions || []).find((v, i) => i === this.selectedId);
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
