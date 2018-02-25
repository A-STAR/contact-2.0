import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
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
  @ViewChild('input') input: ElementRef;

  @Input() label: string;
  @Input() placeholder = '';
  @Input() renderer: (option: ILabeledValue) => void;
  @Input() required: boolean;
  @Input() styles: CSSStyleDeclaration;

  @Output() select = new EventEmitter<ILabeledValue[]>();

  private _active: ILabeledValue;
  private _autoAlign = false;
  // private _autocomplete: ILabeledValue[] = [];
  private _disabled = false;
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
  set active(option: ILabeledValue) {
    this._active = option;
    this.selectedIndex = option && option.value || null;
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.input.nativeElement.contains(event.target) && this.open) {
      this.hideOptions();
    }
  }

  writeValue(value: number): void {
    this.selectedIndex = value;
    this.active = this.selectedOption;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
    this.cdRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.required && this.selectedIndex == null
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

  get caretCls(): string {
    return this.open ? 'up' : '';
  }

  onInputClick(event: MouseEvent): void {
    if (!this.open) {
      this.showOptions();
    } else {
      this.hideOptions();
    }
  }

  onModelChange(value: string): void {
    const foundIndex = this.options.findIndex(o => o.label === value);
    this.selectedIndex = foundIndex > -1 ? foundIndex : null;
    this.propagateChange(event);
  }

  // onMatchClick(event: Event): void {
  //   this.stopEvent(event);

  //   if (this._disabled) {
  //     return;
  //   }

  //   if (!this.open) {
  //     this.showOptions();
  //   } else {
  //     this.hideOptions();
  //   }
  // }

  onSelectMatch(event: Event, option: ILabeledValue): void {
    event.stopPropagation();
    event.preventDefault();

    this.active = option;
    this.propagateChange(this.active.value);
    this.select.emit([this.active]);

    this.hideOptions();
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    this.active = null;
    this.propagateChange(null);
  }

  onCaret(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.open) {
      this.hideOptions();
    } else {
      console.log('open', this.open);
      this.showOptions();
      this.cdRef.markForCheck();
    }
  }

  isActive(option: ILabeledValue): boolean {
    return this.selectedIndex === option.value;
  }

  propagateTouched: Function = () => {};

  private propagateChange: Function = () => {};


  private hideOptions(): void {
    this.open = false;
    this.propagateTouched();
  }

  private showOptions(): void {
    this.open = true;
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return R.defaultTo(defaultValue)(value);
  }

}
