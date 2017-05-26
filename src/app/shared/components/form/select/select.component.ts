import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef, AfterViewChecked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';
import { ISelectionAction, OptionsBehavior, ISelectComponent, IdType } from './select-interfaces';

import { escapeRegexp } from './common';
import { stripTags } from './select-pipes';
import { SelectActionHandler } from './select-action';

import { SelectItem } from './select-item';

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
export class SelectComponent implements OnInit, AfterViewChecked, ControlValueAccessor, ISelectComponent {
  @Input() public allowClear = false;
  @Input() public placeholder = '';
  @Input() public childrenField = 'children';
  @Input() public actions: Array<ISelectionAction> = [];
  @Input() public lazyItems: Observable<Array<any>>;
  @Input() public loadLazyItemsOnInit = false;
  @Input() public cachingItems = false;
  @Output() public clickAction: EventEmitter<ISelectionAction> = new EventEmitter();
  @Output() public data: EventEmitter<any> = new EventEmitter();
  @Output() public selected: EventEmitter<any> = new EventEmitter();
  @Output() public removed: EventEmitter<any> = new EventEmitter();
  @Output() public typed: EventEmitter<any> = new EventEmitter();
  @Output() public opened: EventEmitter<any> = new EventEmitter();
  @Output() selectedControlItemsChange: EventEmitter<IdType[]> = new EventEmitter<IdType[]>();

  private _disabled;
  private _canCloseSelectedItem = true;
  private _readonly = true;
  private _multiple = false;
  private _optionsOpened = false;
  private _active: Array<SelectItem> = [];
  private _lazyItemsSubscription: Subscription;
  private _selectActionHandler: SelectActionHandler;

  private onChange: Function = () => {};
  private onTouched: Function = () => {};

  @Input()
  public set items(value: Array<any>) {
    this.initItems(value);
  }

  @Input()
  public set canCloseSelectedItem(value: boolean) {
    this._canCloseSelectedItem = this.toPropertyValue(value, this._canCloseSelectedItem);
  }

  @Input()
  public set readonly(value: boolean) {
    this._readonly = this.toPropertyValue(value, this._readonly);
  }

  @Input()
  public set multiple(value: boolean) {
    this._multiple = this.toPropertyValue(value, this._multiple);
  }

  @Input()
  public set controlDisabled(value: boolean) {
    this._disabled = this.toPropertyValue(value, this._disabled);

    if (this._disabled) {
      this.hideOptions();
    }
  }

  private toPropertyValue(value: boolean, defaultValue: boolean): boolean {
    return typeof value === 'undefined' ? defaultValue : (value || undefined);
  }

  public get canCloseSelected(): boolean {
    return this._canCloseSelectedItem;
  }

  public get multiple(): boolean {
    return this._multiple;
  }

  public get readonly(): boolean {
    return this._readonly;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public get active(): Array<any> {
    return this._active;
  }

  @Input()
  public set active(selectedItems: Array<any>) {
    this._active = [];

    let currentSelectedItems: number|Array<any> = selectedItems;
    if (typeof currentSelectedItems === 'number') {
      const optionValue: SelectItem = this.itemObjects.find((item: SelectItem) => String(item.id) === String(currentSelectedItems));
      if (optionValue) {
        currentSelectedItems = [
          { value: optionValue.id, label: optionValue.text}
        ];
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
    if (Array.isArray(currentSelectedItems) && currentSelectedItems.length) {
      const areItemsStrings = typeof currentSelectedItems[0] === 'string';

      this._active = currentSelectedItems.map((item: any) => {
        const data = areItemsStrings
          ? item
          : { id: item.value, text: item.label, selected: item.selected } ;
        return new SelectItem(data);
      });
    }
  }

  public options: Array<SelectItem> = [];
  public itemObjects: Array<SelectItem> = [];
  public activeOption: SelectItem;

  private inputMode = false;
  private behavior: OptionsBehavior;
  private inputValue = '';

  private set optionsOpened(value: boolean){
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  private initItems(value: Array<ILabeledValue>): void {
    if (value) {
      this.itemObjects = value.map((item: ILabeledValue) =>
        new SelectItem({ id: item.value, text: item.label, selected: item.selected, context: item.context })
      );
    } else {
      this.itemObjects = [];
    }
  }

  private initLazyItems(): void {
    if (this.cachingItems && this._lazyItemsSubscription) {
      this.afterInitItems();
      return;
    }
    this._lazyItemsSubscription = this.lazyItems.subscribe((loadedItems: Array<any>) => {
      this.initItems(loadedItems);
      this.afterInitItems();

      if (this.active.length) {
        this.active = this.active.map((item: SelectItem) => {
          const valueItem = loadedItems.find((loadedItem) => loadedItem.value === item.id);
          return {
            value: item.id,
            label: valueItem && valueItem.label,
            selected: item.selected,
            context: item.context
          };
        });
      }
    });
  }

  private get optionsOpened(): boolean{
    return this._optionsOpened;
  }

  public constructor(public element: ElementRef,
                     private sanitizer: DomSanitizer) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
    this._selectActionHandler = new SelectActionHandler(this);
  }

  actionClick(action: ISelectionAction, $event: Event): void {
    $event.stopPropagation();

    this._selectActionHandler.handle(action);
    this.clickAction.emit(action);
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
    // backspace
    if (!isUpMode && e.keyCode === 8) {
      const el: any = this.element.nativeElement
        .querySelector('div.ui-select-container > input');
      if (!el.value || el.value.length <= 0) {
        if (this.active.length > 0) {
          this.remove(this.active[this.active.length - 1]);
        }
        e.preventDefault();
      }
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }
    // del
    if (!isUpMode && e.keyCode === 46) {
      if (this.active.length > 0) {
        this.remove(this.active[this.active.length - 1]);
      }
      e.preventDefault();
    }
    // left
    if (!isUpMode && e.keyCode === 37 && this.itemObjects.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this.itemObjects.length > 0) {
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
      this.behavior.filter(new RegExp(escapeRegexp(this.inputValue), 'ig'));
      this.doEvent('typed', this.inputValue);
    }else {
      this.open();
    }
  }

  public writeValue(value: any): void {
    this.active = value;
    this.data.emit(this.active);
  }

  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  /**
   * @override
   */
  public ngOnInit(): void {
    this.behavior = new GenericBehavior(this);

    if (this.loadLazyItemsOnInit) {
      this.initLazyItems();
    }
  }

  /**
   * @override
   */
  public ngAfterViewChecked(): void {
    const selectNativeElement: Element = this.behavior.getSelectNativeElement();
    if (selectNativeElement) {
      // TODO Define select field behaviour
    }
  }

  public remove(item: SelectItem): void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple === true && this.active) {
      const index = this.active.indexOf(item);
      this.active.splice(index, 1);
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
    if (this.multiple === false) {
      this.active = [];
      this.data.next(this.active);
      this.doEvent('removed', item);
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
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public get firstItemHasChildren(): boolean {
    return false;
  }

  protected matchClick(e: any): void {
    if (this._disabled === true) {
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  protected  mainClick(event: any): void {
    if (this.inputMode === true || this._disabled === true) {
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
    this.inputMode = true;
    let value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    let target = event.target || event.srcElement;
    target.value = value;
    this.inputEvent(event);
  }

  protected selectActive(value: SelectItem): void {
    this.activeOption = value;
  }

  protected isActive(value: SelectItem): boolean {
    return this.activeOption.id === value.id;
  }

  activeItemClick(selectItem: SelectItem, $event: MouseEvent): void {
    this.stopEvent($event);

    this.active.forEach((item: SelectItem) => {
      if (item !== selectItem) {
        item.selected = false;
      }
    });
    selectItem.selected = !selectItem.selected;

    this.selectedControlItemsChange.emit(
      this.active
        .filter((item: SelectItem) => item.selected)
        .map((item: SelectItem) => item.id)
    );
  }

  isInputVisible(): boolean {
    return !this.multiple || !this.active.length;
  }

  removeClick(selectItem: SelectItem, $event: Event): void {
    this.stopEvent($event);
    this.remove(selectItem);
    selectItem.selected = false;
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
    if (this.lazyItems) {
      this.initLazyItems();
    } else {
      this.afterInitItems();
    }
    this.optionsOpened = true;
  }

  private afterInitItems(): void {
    this.options = this.itemObjects
      .filter((option: SelectItem) => (this.multiple === false ||
      this.multiple === true && !this.active.find((o: SelectItem) => option.text === o.text)));

    if (this.options.length > 0) {
      this.behavior.first();
    }
  }

  private hideOptions(): void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  private selectActiveMatch(): void {
    this.selectMatch(this.activeOption);
  }

  private selectMatch(value: SelectItem, e: Event = void 0): void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.options.length <= 0) {
      return;
    }
    if (this.multiple === true) {
      this.active.push(value);
      this.data.next(this.active);
    }
    if (this.multiple === false) {
      this.active[0] = value;
      this.data.next(this.active[0]);
    }
    this.doEvent('selected', value);
    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      this.focusToInput(stripTags(value.text));
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
  }

  private stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }
}

export class Behavior {
  public optionsMap:Map<string, number> = new Map<string, number>();

  public actor:SelectComponent;

  public constructor(actor:SelectComponent) {
    this.actor = actor;
  }

  public getSelectNativeElement(): Element {
    return this.actor.element.nativeElement.querySelector('.ui-select-choices');
  }

  public ensureHighlightVisible(optionsMap:Map<string, number> = void 0):void {
    let container = this.actor.element.nativeElement.querySelector('.ui-select-choices-content');
    if (!container) {
      return;
    }
    let choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    let activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    let highlighted:any = choices[activeIndex];
    if (!highlighted) {
      return;
    }
    let posY:number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    let height:number = container.offsetHeight;
    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }

  private getActiveIndex(optionsMap: Map<IdType, number> = void 0): number {
    let ai = this.actor.options.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== void 0) {
      ai = optionsMap.get(this.actor.activeOption.id);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last():void {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev():void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next():void {
    let index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query:RegExp):void {
    let options = this.actor.itemObjects
      .filter((option:SelectItem) => {
        return stripTags(option.text).match(query) &&
          (this.actor.multiple === false ||
          (this.actor.multiple === true && this.actor.active.map((item:SelectItem) => item.id).indexOf(option.id) < 0));
      });
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    }
  }
}
