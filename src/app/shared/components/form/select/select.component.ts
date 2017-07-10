import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  forwardRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { ISelectionAction } from './select-interfaces';

import { SelectionToolsPlugin } from './selection-tools.plugin';

export type SelectInputValueType = number|string|ILabeledValue[];

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

  // Inputs with presets
  @Input() placeholder = '';
  @Input() filterEnabled = false;

  @Input() styles: CSSStyleDeclaration;
  @Input() actions: Array<ISelectionAction> = [];

  // Outputs
  @Output() onSelect: EventEmitter<ILabeledValue[]> = new EventEmitter<ILabeledValue[]>();
  @Output() onSelectedItems: EventEmitter<ILabeledValue[]> = new EventEmitter<ILabeledValue[]>();
  @Output() clickAction: EventEmitter<ISelectionAction> = new EventEmitter<ISelectionAction>();

  @ViewChild('input') inputRef: ElementRef;

  // Template fields
  rawData: ILabeledValue[] = [];

  sortType: string;
  optionsOpened = false;

  private _inputMode = false;
  private _disabled;
  private _canSelectMultipleItem = true;
  private _closableSelectedItem = true;
  private _readonly = true;
  private _multiple = false;

  // Private fields
  private _active: ILabeledValue[];
  private _autoAlignEnabled = false;
  private selectionToolsPlugin: SelectionToolsPlugin;

  private onChange: Function = () => {};

  @Input()
  set options(value: ILabeledValue[]) {
    this.rawData = value || [];
  }

  @Input()
  set closableSelectedItem(value: boolean) {
    this._closableSelectedItem = this.toPropertyValue(value, this._closableSelectedItem);
  }

  @Input()
  set readonly(value: boolean) {
    this._readonly = this.toPropertyValue(value, this._readonly);
  }

  @Input()
  set autoAlignEnabled(autoAlignEnabled: boolean) {
    this._autoAlignEnabled = this.toPropertyValue(autoAlignEnabled, this._autoAlignEnabled);
  }

  @Input()
  set multiple(value: boolean) {
    this._multiple = this.toPropertyValue(value, this._multiple);
  }

  @Input()
  set controlDisabled(value: boolean) {
    this._disabled = this.toPropertyValue(value, this._disabled);

    if (this._disabled) {
      this.hideOptions();
    }
  }

  get autoAlignEnabled(): boolean {
    return this._autoAlignEnabled;
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
    return this._disabled || undefined;
  }

  get inputMode(): boolean {
    return this._inputMode;
  }

  get active(): SelectInputValueType {
    return this._active;
  }

  @Input()
  set active(activeValue: SelectInputValueType) {
    this._active = activeValue as ILabeledValue[] || [];

    if (['string', 'number'].includes(typeof this._active)) {
      const selectedRawItem: ILabeledValue = this.lookupAtRawData(activeValue as string | number);
      this._active = selectedRawItem ? [selectedRawItem] : [ { value: this._active } ];
    }
    if (this.canSelectMultipleItem && this.multiple && this._active.length) {
      this._active[0].selected = true;
    }
  }

  constructor(
    public element: ElementRef,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
  ) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
    this.selectionToolsPlugin = new SelectionToolsPlugin(this);
  }

  writeValue(value: any): void {
    this.active = value;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  isItemContextExist(item: ILabeledValue): boolean {
    return item.context && !!Object.keys(item.context).length;
  }

  canCloseItem(item: ILabeledValue): boolean {
    return this.closableSelectedItem
      && !!this._active.length
      && this.lookupAtRawData(item.value).canRemove !== false;
  }

  actionClick(action: ISelectionAction, $event: Event): void {
    this.stopEvent($event);

    this.selectionToolsPlugin.handle(action);
    this.clickAction.emit(action);
  }

  get displayPlaceholder(): string|number {
    return !!this._active.length ?  this.extractDisplayValue(this._active[0]) : (this.placeholder || '');
  }

  extractDisplayValue(item: ILabeledValue): string|number {
    return item.label
      ? this.translateService.instant(item.label)
      : item.value;
  }

  toDisplayValue(item: ILabeledValue): SafeHtml {
    let displayValue: string;

    if (item.label) {
      displayValue = item.label;
    } else {
      const itemAtRawData: ILabeledValue = this.lookupAtRawData(item.value);
      if (itemAtRawData) {
        displayValue = itemAtRawData.label;
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(
      displayValue
        ? this.translateService.instant(displayValue)
        : item.value
    );
  }

  remove(item: ILabeledValue): void {
    if (this.canSelectMultipleItem) {
      item.selected = false;
    }
    item.removed = true;

    if (this.multiple === true && this._active) {
      this.active = this._active.filter((i: ILabeledValue) => i !== item);
    } else if (this.multiple === false) {
      this.active = [];
    }
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
      this.onSelectedItems.emit(this.rawData);
    }
  }

  isInputVisible(): boolean {
    return !this.multiple || !this._active.length;
  }

  onRemoveItem(item: ILabeledValue, $event: Event): void {
    this.stopEvent($event);
    this.remove(item);
    this.onSelectedItems.emit(this.rawData);
  }

  onInputClick($event: Event): void {
    this.stopEvent($event);
    this.hideOptions();
  }

  onMatchClick($event: Event): void {
    this.stopEvent($event);

    if (this._disabled === true) {
      return;
    }

    this._inputMode = !this._inputMode;
    if (this._inputMode) {
      this.open();
    } else {
      this.hideOptions();
    }
  }

  isActive(labeledValue: ILabeledValue): boolean {
    return !!this._active.find((v: ILabeledValue) => v.value === labeledValue.value);
  }

  private open(): void {
    this.optionsOpened = true;
  }

  private hideOptions(): void {
    this._inputMode = false;
    this.optionsOpened = false;
  }

  onSelectMatch($event: Event, labeledValue: ILabeledValue): void {
    this.stopEvent($event);

    if (this.multiple) {
      if (this.isActive(labeledValue)) {
        this.hideOptions();
        return;
      }
      this._active.push(labeledValue);
      if (!this._active.find(item => item.selected)) {
        // If no one has been selected yet
        labeledValue.selected = true;
      }
    } else {
      this._active = [labeledValue];
    }
    this.onChange(this._active);

    this.onSelect.emit(this._active);
    this.onSelectedItems.emit(this.rawData);

    this.hideOptions();
  }

  private stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  private toPropertyValue(value: boolean, defaultValue: boolean): boolean {
    return R.isNil(value) ? defaultValue : value;
  }

  private lookupAtRawData(value: number|string): ILabeledValue {
    return this.rawData.find(item => String(item.value) === String(value));
  }
}
