import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  // ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import * as R from 'ramda';

import { ILabeledValue } from './select.interface';

import { SortOptionsPipe } from '@app/shared/components/form/select/select-pipes';

@Component({
  selector: 'app-select',
  styleUrls: ['./select.component.scss'],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor, Validator {
  // @ViewChild('input') input: ElementRef;

  @Input() label: string;
  @Input() placeholder = '';
  @Input() renderer: (option: ILabeledValue) => void;
  @Input() styles: CSSStyleDeclaration;

  @Output() select = new EventEmitter<ILabeledValue[]>();

  private _active: ILabeledValue;
  private _autoAlign = false;
  private _autocomplete: ILabeledValue[] = [];
  private _disabled = false;
  private _required = false;
  private _options: ILabeledValue[] = [];
  private open = false;
  private selectedIndex: number = null;

  @Input()
  set options(options: ILabeledValue[]) {
    this._options = this.sortOptionsPipe.transform(options);
  }

  get options(): ILabeledValue[] {
    return this._options;
  }

  @Input()
  set autoAlign(autoAlign: boolean) {
    this._autoAlign = this.setDefault(autoAlign, this._autoAlign);
  }

  get autoAlign(): boolean {
    return this._autoAlign;
  }

  @Input()
  set isDisabled(value: boolean) {
    this._disabled = this.setDefault(value, this._disabled);

    if (this._disabled) {
      this.hideOptions();
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set isRequired(value: boolean) {
    this._required = value;
  }

  get required(): boolean {
    return this._required;
  }

  @Input()
  set active(option: ILabeledValue) {
    this._active = option;
    this.selectedIndex = option.value;
  }

  get active(): ILabeledValue {
    return this._active;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private sortOptionsPipe: SortOptionsPipe,
  ) {
    this.hideOptions = this.hideOptions.bind(this);
    this.renderer = (option: ILabeledValue) => option.label;
  }

  writeValue(value: number): void {
    this.selectedIndex = value;
    this.active = this.selectedOption;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
    this.cdRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors {
    return control.enabled && this.selectedIndex === null
      ? { required: true }
      : null;
  }

  get activeLabel(): string {
    return this.selectedIndex !== null
      ? this.active.label || ''
      : '';
  }

  get selectedOption(): ILabeledValue {
    return this.options.find(v => v.value === this.selectedIndex);
  }

  onInputClick(event: MouseEvent): void {
    this.stopEvent(event);
    if (!this.open) {
      this.showOptions();
    } else {
      this.hideOptions();
    }
  }

  onAutocomplete(event: MouseEvent): void {
    // console.log('autocomplete', event);
  }

  onMatchClick(event: Event): void {
    this.stopEvent(event);

    if (this._disabled) {
      return;
    }

    if (!this.open) {
      this.showOptions();
    } else {
      this.hideOptions();
    }
  }

  onSelectMatch(event: Event, option: ILabeledValue): void {
    this.stopEvent(event);

    this.active = option;
    this.onChange(this.active.value);
    this.select.emit([this.active]);

    this.hideOptions();
  }

  isActive(option: ILabeledValue): boolean {
    return this.selectedIndex === option.value;
  }

  private onChange: Function = () => {};

  private onTouched: Function = () => {};

  private hideOptions(): void {
    this.open = false;
    this.onTouched(this.active);
  }

  private showOptions(): void {
    this.open = true;
  }

  private stopEvent(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return R.defaultTo(defaultValue)(value);
  }

}
