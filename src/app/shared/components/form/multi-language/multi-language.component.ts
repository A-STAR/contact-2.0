import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Renderer2 } from '@angular/core';

import { IMultiLanguageOption } from './multi-language.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

@Component({
  selector: 'app-multilanguage-input',
  templateUrl: './multi-language.component.html',
  styleUrls: ['./multi-language.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiLanguageComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiLanguageComponent implements ControlValueAccessor {
  @ContentChild('input') input: ElementRef;
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _langOptions: IMultiLanguageOption[] = [];
  private selectedId: number;

  constructor(private cdRef: ChangeDetectorRef, private renderer: Renderer2) {}

  @Input() disabled = false;
  @Input() label = '';
  @Input() placeholderKey = 'Enter translation value';
  @Input() required = false;

  @Input('langOptions')
  set langOptions(options: IMultiLanguageOption[]) {
    this._langOptions = options.map(option => ({
      ...option,
      active: !!option.isMain,
    }));

    this.selectedId = options.length ? 0 : null;
    const value = this.selectedId !== null ? this._langOptions[this.selectedId].value : null;
    this.onValueChange(value);
    this.cdRef.markForCheck();
  }

  get langOptions(): IMultiLanguageOption[] {
    return this._langOptions;
  }

  // NOTE: need this for the validator interface
  get value(): IMultiLanguageOption[] {
    return this._langOptions;
  }

  writeValue(value: string): void {
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: () => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  get translation(): string {
    const option = (this.langOptions || []).find(
      (v, i) => i === this.selectedId,
    );
    return option ? option.value : null;
  }

  get buttonText(): string {
    const option = (this.langOptions || []).find(
      (v, i) => i === this.selectedId,
    );
    return option ? option.label : '';
  }

  onLanguageChange(option: IMultiLanguageOption): void {
    this.selectedId = this.langOptions.findIndex(
      v => v.languageId === option.languageId,
    );
    this.dropdown.close();
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

  onClear(event: MouseEvent): void {
    event.preventDefault();
    this.onValueChange(null);
  }

  onLabelClick(event: MouseEvent): void {
    event.preventDefault();
  }

  onFocusOut(): void {
    this.propagateTouched();
  }

  setDisabledState(disabled: boolean): void {
    this.renderer.setProperty(this.input.nativeElement, 'disabled', disabled);
  }

  private propagateChange: Function = () => {};

  private propagateTouched: Function = () => {};

}
