import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

import { ISelectionAction, SelectionActionTypeEnum, ILabeledValue } from './select.interface';

// NOTE: declaring it here to avoid compile-time error
type SelectInputValueType = number | string | ILabeledValue[];

@Component({
  selector: 'app-select',
  styleUrls: ['./select.component.scss'],
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements ControlValueAccessor {
  @ViewChild('input') input: ElementRef;

  /**
   * `true` means the control's `required` property is false,
   *  therefore an empty/null value can be selected
   */
  @Input() isRequired = false;
  @Input() label: string;
  @Input() nullable = true;
  @Input() placeholder = '';
  @Input() renderer: any;
  @Input() styles: CSSStyleDeclaration;

  @Output() onSelect = new EventEmitter<ILabeledValue[]>();

  sortType: string;
  optionsOpened = false;

  private activeValue: number = null;
  private _active: ILabeledValue[];
  private _autoAlign = false;
  private _disabled = false;
  private _inputMode = false;
  private _emptyOption: ILabeledValue = { value: null, label: 'default.select.empty' };
  private _options: ILabeledValue[] = [];

  @Input()
  set options(options: ILabeledValue[]) {
    this._options = this.nullable
      ? [].concat(this._emptyOption, options || [])
      : [].concat(options || []);
  }

  @Input()
  set autoAlign(autoAlign: boolean) {
    this._autoAlign = this.setDefault(autoAlign, this._autoAlign);
  }

  @Input()
  set controlDisabled(value: boolean) {
    this._disabled = this.setDefault(value, this._disabled);

    if (this._disabled) {
      this.hideOptions();
    }
  }

  get options(): ILabeledValue[] {
    return this._options;
  }

  get autoAlign(): boolean {
    return this._autoAlign;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get inputMode(): boolean {
    return this._inputMode;
  }

  @Input()
  set active(activeValue: SelectInputValueType) {
    this._active = activeValue as ILabeledValue[] || [];

    if (['string', 'number'].includes(typeof this._active)) {
      const option = this.lookupAtOptions(activeValue as string | number);
      if (option) {
        this._active = [ this.getValue(option) ];
      } else {
        this._active = [ { value: this._active } ];
      }
    }
  }

  get active(): SelectInputValueType {
    return this._active;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    public element: ElementRef,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
  ) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
  }

  writeValue(value: number): void {
    this.activeValue = value;
    this.active = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cdRef.markForCheck();
  }

  get activeLabel(): string {
    if (this.activeValue === null) {
      return '';
    }
    const active = this.options.find(v => v.value === this.activeValue);
    return active ? (active.label || '') : '';
  }

  get displayPlaceholder(): string|number {
    return this.activeLabel || this.placeholder || '';
  }

  get filteredActiveItems(): ILabeledValue[] {
    return (this.active as ILabeledValue[]).filter(value => !value.removed);
  }

  toDisplayValue(item: ILabeledValue): SafeHtml {
    let displayValue: string;

    if (item.label) {
      displayValue = this.translateService.instant(item.label);
    } else {
      const option = this.lookupAtOptions(item.value);
      if (option && option.label) {
        displayValue = this.translateService.instant(option.label);
      }
    }

    return this.sanitizer
      .bypassSecurityTrustHtml(this.renderer ? this.renderer(displayValue, item) : (displayValue || item.value));
  }

  clickedOutside(): void {
    this._inputMode = false;
    this.optionsOpened = false;
  }

  onActiveItemClick(item: ILabeledValue, $event: MouseEvent): void {
    this.stopEvent($event);
  }

  isInputVisible(): boolean {
    return this.active && !this._active.length;
  }

  onInputClick($event: Event): void {
    this.stopEvent($event);
    this.hideOptions();
  }

  onMatchClick($event: Event): void {
    this.stopEvent($event);

    if (this._disabled) {
      return;
    }

    this._inputMode = !this._inputMode;
    if (this._inputMode) {
      this.open();
    } else {
      this.hideOptions();
    }
  }

  isActive(option: ILabeledValue): boolean {
    return !!this._active.find(v => v.value === option.value);
  }

  onSelectMatch($event: Event, option: ILabeledValue): void {
    this.stopEvent($event);

    this._active = [ this.getValue(option) ];
    this.onChange(this._active);
    this.onSelect.emit(this._active);

    this.hideOptions();
  }

  private onChange: Function = () => {};

  private open(): void {
    this.optionsOpened = true;
  }

  private hideOptions(): void {
    this._inputMode = false;
    this.optionsOpened = false;
  }

  private stopEvent(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return R.defaultTo(defaultValue)(value);
  }

  private lookupAtOptions(value: number|string): ILabeledValue {
    return (this.options || []).find(item => String(item.value) === String(value));
  }

  private getValue(option: ILabeledValue): ILabeledValue {
    return { value: option.value };
  }

}
