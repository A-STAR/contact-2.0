import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  forwardRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as R from 'ramda';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { ISelectionAction, OptionsBehavior, IdType, SelectInputValueType } from './select-interfaces';

import { SelectionToolsPlugin } from './selection-tools.plugin';

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
export class SelectComponent implements OnInit, ControlValueAccessor {

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

  activeOption: ILabeledValue;
  sortType: string;
  optionsOpened = false;

  private _inputMode = false;
  private _disabled;
  private _canSelectMultipleItem = true;
  private _closableSelectedItem = true;
  private _readonly = true;
  private _multiple = false;
  private behavior: OptionsBehavior;

  // Private fields
  private _active: ILabeledValue[];
  private _autoAlignEnabled = false;
  private selectionToolsPlugin: SelectionToolsPlugin;

  private onChange: Function = () => {};
  private onTouched: Function = () => {};

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
    return this._disabled;
  }

  get inputMode(): boolean {
    return this._inputMode;
  }

  get active(): SelectInputValueType {
    return this._active;
  }

  @Input()
  set active(activeValue: SelectInputValueType) {
    this._active = activeValue as ILabeledValue[];

    if (['string', 'number'].includes(typeof this._active)) {
      const selectedRawItem: ILabeledValue = this.lookupAtRawData(activeValue as string | number);
      this._active = selectedRawItem ? [selectedRawItem] : [ { value: this._active } ];
    }
    if (this.canSelectMultipleItem && this.multiple && this._active.length) {
      this._active[0].selected = true;
    }
    this.changeRef.detectChanges();
  }

  constructor(
    public element: ElementRef,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private changeRef: ChangeDetectorRef,
  ) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
    this.selectionToolsPlugin = new SelectionToolsPlugin(this);
  }

  ngOnInit(): void {
    this.behavior = new GenericBehavior(this);
  }

  writeValue(value: any): void {
    this.active = value;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  isItemContextExist(item: ILabeledValue): boolean {
    return item.context && !!Object.keys(item.context).length;
  }

  canCloseSelectedItem(item: ILabeledValue): boolean {
    const itemAtRawData: ILabeledValue = this.lookupAtRawData(item.value);

    return this.closableSelectedItem
      && this._active.length > 1
      && item.canRemove !== false
      && (!itemAtRawData || itemAtRawData.canRemove !== false);
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

  private lookupAtRawData(value: number|string): ILabeledValue {
    return this.rawData
      .find((item: ILabeledValue) => String(item.value) === String(value));
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

  activeItemClick(item: ILabeledValue, $event: MouseEvent): void {
    this.stopEvent($event);

    if (this.canSelectMultipleItem) {
      this._active.forEach((i: ILabeledValue) => i.selected = false);
      if (!item.selected) {
        item.selected = true;
      }
      this.onSelectedItems.emit(this.rawData);
    }
  }

  isInputVisible(): boolean {
    return !this.multiple || !this._active.length;
  }

  removeClick(item: ILabeledValue, $event: Event): void {
    this.stopEvent($event);
    this.remove(item);
    this.onSelectedItems.emit(this.rawData);
  }

  onInputClick($event: Event): void {
    this.stopEvent($event);
    this.hideOptions();
  }

  matchClick($event: Event): void {
    this.stopEvent($event);

    if (this._disabled === true || !this.canSelectMultiItem()) {
      return;
    }

    this._inputMode = !this._inputMode;
    if (this._inputMode === true && ((this.multiple === true && $event) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    } else {
      this.hideOptions();
    }
  }

  protected mainClick(event: any): void {
    if (this._inputMode === true || this._disabled === true || !this.canSelectMultiItem()) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      return;
    }
    if (event.keyCode === 9 || event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }
    this._inputMode = true;
    const value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    const target = event.target || event.srcElement;
    target.value = value;
  }

  protected selectActive(value: ILabeledValue): void {
    this.activeOption = value;
  }

  protected isActive(labeledValue: ILabeledValue): boolean {
    return !!this._active.find((v: ILabeledValue) => v.value === labeledValue.value);
  }

  private focusToInput(value: string = ''): void {
    setTimeout(() => {
      const el = this.getInputElement();
      if (el) {
        el.value = value;
      }
    }, 0);
  }

  private getInputElement(): any {
    return this.element.nativeElement.querySelector('div.ui-select-container > input');
  }

  private open(): void {
    if (this.rawData.length > 0) {
      this.behavior.first();
    }
    this.optionsOpened = true;
  }

  private hideOptions(): void {
    this._inputMode = false;
    this.optionsOpened = false;
  }

  onSelectMatch($event: Event, value: ILabeledValue): void {
    this.stopEvent($event);

    if (!this.rawData.length) {
      return;
    }
    if (this.multiple === true) {
      this._active.push(value);
      if (!this._active.find((item: ILabeledValue) => item.selected)) {
        // If no one has been selected yet
        value.selected = true;
      }
    } else if (this.multiple === false) {
      this.active = [value];
    }
    this.onSelect.emit(this._active);
    this.onTouched();
    this.onChange(this._active);

    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      this.focusToInput(value.label);
    }
    this.onSelectedItems.emit(this.rawData);
  }

  private canSelectMultiItem(): boolean {
    return this.rawData.length > this._active.length;
  }

  private stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }

  private toPropertyValue(value: boolean, defaultValue: boolean): boolean {
    return R.isNil(value) ? defaultValue : value;
  }
}

export class Behavior {
  optionsMap: Map<string, number> = new Map<string, number>();

  actor: SelectComponent;

  constructor(actor: SelectComponent) {
    this.actor = actor;
  }

  ensureHighlightVisible(optionsMap: Map<string, number> = void 0): void {
    const container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
    if (!container) {
      return;
    }
    const choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    const activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    const highlighted: any = choices[activeIndex];
    if (!highlighted) {
      return;
    }
    const posY: number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    const height: number = container.offsetHeight;
    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }

  private getActiveIndex(optionsMap: Map<IdType, number> = void 0): number {
    let ai = this.actor.rawData.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== void 0) {
      ai = optionsMap.get(this.actor.activeOption.value);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  constructor(actor: SelectComponent) {
    super(actor);
  }

  first(): void {
    this.actor.activeOption = this.actor.rawData[0];
    super.ensureHighlightVisible();
  }

  last(): void {
    this.actor.activeOption = this.actor.rawData[this.actor.rawData.length - 1];
    super.ensureHighlightVisible();
  }

  prev(): void {
    const index = this.actor.rawData.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .rawData[index - 1 < 0 ? this.actor.rawData.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  next(): void {
    const index = this.actor.rawData.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .rawData[index + 1 > this.actor.rawData.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }
}
