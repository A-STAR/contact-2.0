import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { ISelectionAction, OptionsBehavior, IdType } from './select-interfaces';

import { SelectActionHandler } from './select-action';

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
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @Input() allowClear = false;
  @Input() placeholder = '';
  @Input() actions: Array<ISelectionAction> = [];
  @Input() lazyItems: Observable<Array<any>>;
  @Input() loadLazyItemsOnInit = false;
  @Input() cachingItems = false;
  @Output() clickAction: EventEmitter<ISelectionAction> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() typed: EventEmitter<any> = new EventEmitter();
  @Output() opened: EventEmitter<any> = new EventEmitter();
  @Output() selectedControlItemsChanges: EventEmitter<ILabeledValue[]> = new EventEmitter<ILabeledValue[]>();

  rawData: Array<ILabeledValue> = [];
  activeOption: ILabeledValue;
  sortType: string;

  private _inputMode = false;
  private _disabled;
  private _canSelectMultipleItem = true;
  private _canCloseSelectedItem = true;
  private _readonly = true;
  private _multiple = false;
  private _optionsOpened = false;
  private _active: ILabeledValue[] = [];
  private _lazyItemsSubscription: Subscription;
  private _selectActionHandler: SelectActionHandler;
  private behavior: OptionsBehavior;
  private inputValue = '';

  private onChange: Function = () => {};
  private onTouched: Function = () => {};

  @Input()
  set items(value: Array<ILabeledValue>) {
    this.rawData = value || [];
  }

  @Input()
  set canCloseSelectedItem(value: boolean) {
    this._canCloseSelectedItem = this.toPropertyValue(value, this._canCloseSelectedItem);
  }

  @Input()
  set readonly(value: boolean) {
    this._readonly = this.toPropertyValue(value, this._readonly);
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

  get canSelectMultipleItem(): boolean {
    return this._canSelectMultipleItem;
  }

  get canCloseSelected(): boolean {
    return this._canCloseSelectedItem;
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

  get active(): Array<ILabeledValue> {
    return this._active;
  }

  @Input()
  set active(selectedItems: Array<ILabeledValue>) {
    let currentSelectedItems: number|Array<any> = selectedItems;
    if (typeof currentSelectedItems === 'number') {
      const selectedRawItem: ILabeledValue = this.rawData
        .find((item: ILabeledValue) => String(item.value) === String(currentSelectedItems));

      if (selectedRawItem) {
        currentSelectedItems = [selectedRawItem];
      } else {
        /**
         * loadLazyItemsOnInit: true +
         * lazyOptions: Observable +
         * edit mode + set initial form values +
         * number input item
         */
        currentSelectedItems = [
          { value: currentSelectedItems }
        ];
      }
    }
    this._active = currentSelectedItems || [];

    if (this.canSelectMultipleItem && this.multiple === true && this._active.length) {
      this._active[0].selected = true;
    }
  }

  constructor(
    public element: ElementRef,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService
  ) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
    this._selectActionHandler = new SelectActionHandler(this);
  }

  ngOnInit(): void {
    this.behavior = new GenericBehavior(this);

    if (this.loadLazyItemsOnInit) {
      this.initLazyItems();
    }
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

  private toPropertyValue(value: boolean, defaultValue: boolean): boolean {
    return typeof value === 'undefined' ? defaultValue : (value || undefined);
  }

  private set optionsOpened(value: boolean){
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  private initLazyItems(): void {
    if (this.cachingItems && this._lazyItemsSubscription) {
      this.afterInitItems();
      return;
    }
    this._lazyItemsSubscription = this.lazyItems.subscribe((loadedItems: Array<ILabeledValue>) => {
      this.rawData = loadedItems.map((item: ILabeledValue) => {
        const activatedItem: ILabeledValue = this.active.find((activeItem: ILabeledValue) => item.value === activeItem.value);
        if (activatedItem) {
          activatedItem.label = item.label;
          return activatedItem;
        }
        return item;
      });

      this.active = this.rawData.filter((item: ILabeledValue) =>
        this.active.find((activeItem: ILabeledValue) => item.value === activeItem.value));

      this.afterInitItems();
    });
  }

  isItemContextPresent(item: ILabeledValue): boolean {
    return item.context && Object.keys(item.context).length > 0;
  }

  private get optionsOpened(): boolean{
    return this._optionsOpened;
  }

  actionClick(action: ISelectionAction, $event: Event): void {
    $event.stopPropagation();

    this._selectActionHandler.handle(action);
    this.clickAction.emit(action);
  }

  toCleanedAndTranslatedLabel(item: ILabeledValue): SafeHtml {
    return item.label
      ? this.sanitizer.bypassSecurityTrustHtml(this.translateService.instant(item.label))
      : item.value;
  }

  public inputEvent(e: any, isUpMode: boolean = false): void {
    // tab
    if (e.keyCode === 9) {
      return;
    }
    if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
      e.keyCode === 40 || e.keyCode === 13)) {
      e.preventDefault();
      return;
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }
    // left
    if (!isUpMode && e.keyCode === 37 && this.rawData.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this.rawData.length > 0) {
      this.behavior.last();
      e.preventDefault();
      return;
    }
    // up
    if (!isUpMode && e.keyCode === 38) {
      this.behavior.prev();
      e.preventDefault();
      return;
    }
    // down
    if (!isUpMode && e.keyCode === 40) {
      this.behavior.next();
      e.preventDefault();
      return;
    }
    // enter
    if (!isUpMode && e.keyCode === 13) {
      if (this.active.indexOf(this.activeOption) === -1) {
        this.selectActiveMatch();
        this.behavior.next();
      }
      e.preventDefault();
      return;
    }
    const target = e.target || e.srcElement;
    if (target && target.value) {
      this.inputValue = target.value;
    }else {
      this.open();
    }
  }

  remove(item: ILabeledValue): void {
    if (this.canSelectMultipleItem) {
      item.selected = false;
    }
    item.removed = true;

    if (this.multiple === true && this.active) {
      this.active = this.active.filter((i: ILabeledValue) => i !== item);
    } else if (this.multiple === false) {
      this.active = [];
    }
  }

  public doEvent(type: string, value: any): void {
    if ((this as any)[type] && value) {
      (this as any)[type].next(value);
    }

    this.onTouched();
    if (type === 'selected' || type === 'removed') {
      this.onChange(this.active);
    }
  }

  public clickedOutside(): void {
    this._inputMode = false;
    this.optionsOpened = false;
  }

  protected matchClick(e: any): void {
    if (this._disabled === true) {
      return;
    }
    this._inputMode = !this._inputMode;
    if (this._inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  protected  mainClick(event: any): void {
    if (this._inputMode === true || this._disabled === true) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      this.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      this.inputEvent(event, true);
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
    this.inputEvent(event);
  }

  protected selectActive(value: ILabeledValue): void {
    this.activeOption = value;
  }

  protected isActive(value: ILabeledValue): boolean {
    return this.activeOption.value === value.value;
  }

  activeItemClick(item: ILabeledValue, $event: MouseEvent): void {
    this.stopEvent($event);

    if (this.canSelectMultipleItem) {
      this.active.forEach((i: ILabeledValue) => i.selected = false);
      if (!item.selected) {
        item.selected = true;
      }
      this.selectedControlItemsChanges.emit(this.rawData);
    }
  }

  isInputVisible(): boolean {
    return !this.multiple || !this.active.length;
  }

  removeClick(item: ILabeledValue, $event: Event): void {
    this.stopEvent($event);
    this.remove(item);
    this.selectedControlItemsChanges.emit(this.rawData);
  }

  private focusToInput(value: string = ''): void {
    setTimeout(() => {
      const el = this.getInputElement();
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
  }

  private getInputElement(): any {
    return this.element.nativeElement.querySelector('div.ui-select-container > input');
  }

  private open(): void {
    if (this.active.length === this.rawData.length) {
      return;
    }
    if (this.lazyItems) {
      this.initLazyItems();
    } else {
      this.afterInitItems();
    }
    this.optionsOpened = true;
  }

  private afterInitItems(): void {
    if (this.rawData.length > 0) {
      this.behavior.first();
    }
  }

  private hideOptions(): void {
    this._inputMode = false;
    this.optionsOpened = false;
  }

  private selectActiveMatch(): void {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value: ILabeledValue, $event?: Event): void {
    if ($event) {
      this.stopEvent($event);
    }
    if (!this.rawData.length) {
      return;
    }
    if (this.multiple === true) {
      this.active.push(value);
      if (!this.active.find((item: ILabeledValue) => item.selected)) {
        // If no one has been selected yet
        value.selected = true;
      }
    } else if (this.multiple === false) {
      this.active = [value];
    }
    this.doEvent('selected', value);
    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      this.focusToInput(value.label);
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
    this.selectedControlItemsChanges.emit(this.rawData);
  }

  private stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }
}

export class Behavior {
  public optionsMap: Map<string, number> = new Map<string, number>();

  public actor: SelectComponent;

  public constructor(actor: SelectComponent) {
    this.actor = actor;
  }

  public ensureHighlightVisible(optionsMap: Map<string, number> = void 0): void {
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
  public constructor(actor: SelectComponent) {
    super(actor);
  }

  public first(): void {
    this.actor.activeOption = this.actor.rawData[0];
    super.ensureHighlightVisible();
  }

  public last(): void {
    this.actor.activeOption = this.actor.rawData[this.actor.rawData.length - 1];
    super.ensureHighlightVisible();
  }

  public prev(): void {
    const index = this.actor.rawData.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .rawData[index - 1 < 0 ? this.actor.rawData.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next(): void {
    const index = this.actor.rawData.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .rawData[index + 1 > this.actor.rawData.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }
}
