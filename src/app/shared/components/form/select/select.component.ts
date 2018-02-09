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

  @Input() actions: Array<ISelectionAction> = [];
  @Input() inputClass = 'form-control';
  /**
   * `true` means the control's `required` property is false,
   *  therefore an empty/null value can be selected
   */
  @Input() nullable = true;
  @Input() placeholder = '';
  @Input() renderer: any;
  @Input() styles: CSSStyleDeclaration;

  @Output() onSelect = new EventEmitter<ILabeledValue[]>();
  @Output() clickAction = new EventEmitter<ISelectionAction>();

  @ViewChild('input') inputRef: ElementRef;

  sortType: string;
  optionsOpened = false;

  private _active: ILabeledValue[];
  private _autoAlign = false;
  private _canSelectMultipleItem = true;
  private _closableSelectedItem = true;
  private _disabled = false;
  private _inputMode = false;
  private _emptyOption: ILabeledValue = { value: null, label: 'default.select.empty' };
  private _options: ILabeledValue[] = [];
  private _readonly = true;
  private _multiple = false;

  @Input()
  set options(options: ILabeledValue[]) {
    this._options = this.nullable
      ? [].concat(this._emptyOption, options || [])
      : [].concat(options || []);
  }

  @Input()
  set closableSelectedItem(value: boolean) {
    this._closableSelectedItem = this.setDefault(value, this._closableSelectedItem);
  }

  @Input()
  set readonly(value: boolean) {
    this._readonly = this.setDefault(value, this._readonly);
  }

  @Input()
  set autoAlign(autoAlign: boolean) {
    this._autoAlign = this.setDefault(autoAlign, this._autoAlign);
  }

  @Input()
  set multiple(value: boolean) {
    this._multiple = this.setDefault(value, this._multiple);
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

  get canSelectMultipleItem(): boolean {
    return this._canSelectMultipleItem;
  }

  get closableSelectedItem(): boolean {
    return this._closableSelectedItem;
  }

  get multiple(): boolean {
    return this._multiple;
  }

  get readonly(): boolean {
    return this._readonly;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get inputMode(): boolean {
    return this._inputMode;
  }

  get inputNgClass(): object {
    return {
      [this.inputClass]: true,
      'app-select-search app-select-unselectable': true,
      hidden: !this.isInputVisible(),
    };
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
    if (this.canSelectMultipleItem && this.multiple && this._active.length) {
      this._active[0].selected = true;
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

  writeValue(value: any): void {
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

  isItemContextExist(item: ILabeledValue): boolean {
    return item.context && !!Object.keys(item.context).length;
  }

  handleSort(action: ISelectionAction): void {
    switch (action.type) {
      case SelectionActionTypeEnum.SORT:
        if (action.state === 'down') {
          action.state = 'up';
          action.actionIconCls = 'fa fa-long-arrow-up';
          this.sortType = 'up';
        } else {
          action.state = 'down';
          action.actionIconCls = 'fa fa-long-arrow-down';
          this.sortType = 'down';
        }
        break;
    }
  }

  canCloseItem(item: ILabeledValue): boolean {
    const option = this.lookupAtOptions(item.value);
    return this.closableSelectedItem
      && !!this._active.length
      && option
      && option.canRemove !== false
      && !this._disabled;
  }

  actionClick(action: ISelectionAction, $event: Event): void {
    this.stopEvent($event);

    this.handleSort(action);
    this.clickAction.emit(action);
  }

  get displayPlaceholder(): string|number {
    return !!this._active.length ?  this.extractDisplayValue(this._active[0]) : (this.placeholder || '');
  }

  get filteredActiveItems(): ILabeledValue[] {
    return (this.active as ILabeledValue[]).filter(value => !value.removed);
  }

  extractDisplayValue(item: ILabeledValue): string|number {
    let itemAtOptions = item;
    if (!itemAtOptions.label) {
      itemAtOptions = this.lookupAtOptions(item.value) || item;
    }
    return itemAtOptions.label
      ? this.translateService.instant(itemAtOptions.label)
      : itemAtOptions.value;
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

    if (this.canSelectMultipleItem) {
      this._active.forEach(labeledValue => labeledValue.selected = false);
      if (!item.selected) {
        item.selected = true;
      }
      this.emitSelectActive();
    }
  }

  isInputVisible(): boolean {
    return !this.multiple || !this._active.length;
  }

  onRemoveItem(item: ILabeledValue, $event: Event): void {
    this.stopEvent($event);
    item.selected = false;
    item.removed = true;

    this.selectAtLeastOne();
    this.emitSelectActive();
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
    return !!this._active.find(v => v.value === option.value && !v.removed);
  }

  onSelectMatch($event: Event, option: ILabeledValue): void {
    this.stopEvent($event);

    if (this.multiple) {
      if (this.isActive(option)) {
        this.hideOptions();
        return;
      }
      let item = this._active.find(v => v.value === option.value);
      if (item) {
        delete item.removed;
      } else {
        this._active.push(item = this.getValue(option));
      }
      this.selectAtLeastOne();
    } else {
      this._active = [ this.getValue(option) ];
    }
    this.onChange(this._active);
    this.emitSelectActive();

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

  private stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
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

  private selectAtLeastOne(): void {
    if (!this._active.find(v => v.selected && !v.removed)) {
      const item = this._active.find(v => !v.selected && !v.removed);
      if (item) {
        item.selected = true;
      }
    }
  }

  private emitSelectActive(): void {
    this.onSelect.emit(this._active);
  }
}
