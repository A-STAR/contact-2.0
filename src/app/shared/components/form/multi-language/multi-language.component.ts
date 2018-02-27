import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Renderer2 } from '@angular/core';

import { IMultiLanguageOption } from './multi-language.interface';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';
import { multilanguageRequired } from '@app/core/validators';

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
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiLanguageComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiLanguageComponent implements ControlValueAccessor, Validator {
  @ViewChild('input') input: ElementRef;
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _langOptions: IMultiLanguageOption[] = [];
  private selectedId: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {}

  @Input() isDisabled = false;
  @Input() label = '';
  // This somehow always gets undefined -> explore
  @Input() placeholder = '';
  @Input() isRequired = false;

  @Input('langOptions')
  set langOptions(options: IMultiLanguageOption[]) {
    this._langOptions = options.map(option => ({
      ...option,
      active: !!option.isMain,
    }));

    this.selectedId = options.length ? 0 : null;
    this.propagateChange(this.langOptions.find(o => !!o.active));
    this.cdRef.markForCheck();
  }

  get langOptions(): IMultiLanguageOption[] {
    return this._langOptions;
  }

  writeValue(value: string): void {
    this.cdRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors {

    const valid = this.isRequired
      ? multilanguageRequired(this.langOptions)(control)
      : null;

    this.cdRef.markForCheck();
    return valid;
  }

  registerOnChange(fn: () => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  get value(): string {
    const option = this.selectedOption;
    return option ? option.value : null;
  }

  get buttonText(): string {
    const option = this.selectedOption;
    return option ? option.label : '';
  }

  get selectedOption(): IMultiLanguageOption {
    return (this.langOptions || []).find((v, i) => i === this.selectedId);
  }

  onLanguageChange(option: IMultiLanguageOption): void {
    this.selectedId = this.langOptions.findIndex(v => v.languageId === option.languageId);
    this.dropdown.close();
    this.cdRef.markForCheck();
  }

  onValueChange(value: string): void {
    const option = this.selectedOption;
    if (option) {
      option.value = value;
      option.isUpdated = true;
      this.propagateChange(value);
    }
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    this.onValueChange(null);
  }

  onLabelClick(event: MouseEvent): void {
    event.preventDefault();
    this.input.nativeElement.focus();
  }

  onFocusOut(): void {
    this.propagateTouched();
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
    this.renderer.setProperty(this.input.nativeElement, 'disabled', disabled);
  }

  private propagateChange: Function = () => {};

  private propagateTouched: Function = () => {};

}
