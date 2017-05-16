import {
  Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef, Renderer2, AfterViewChecked
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem } from './select-item';
import { stripTags } from './select-pipes';
import { ISelectionAction, OptionsBehavior, ISelectComponent } from './select-interfaces';
import { escapeRegexp } from './common';
import { SelectActionHandler } from './select-action';

const styles = `
  .ui-select-toggle {
    position: relative;
  }

  /* Fix caret going into new line in Firefox */
  .ui-select-placeholder {
    float: left;
  }
  
  /* Fix Bootstrap dropdown position when inside a input-group */
  .input-group > .dropdown {
    /* Instead of relative */
    position: static;
  }
  
  .ui-select-match > .btn {
    /* Instead of center because of .btn */
    text-align: left !important;
  }
  
  .ui-select-match > .caret {
    position: absolute;
    top: 45%;
    right: 15px;
  }
  
  .ui-disabled {
    background-color: #eceeef;
    border-radius: 4px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0.6;
    top: 0;
    left: 0;
    cursor: not-allowed;
  }
  
  .ui-select-choices {
    width: 100%;
    height: auto;
    max-height: 180px;
    overflow-x: hidden;
    margin-top: 0;
  }
  
  .ui-select-multiple .ui-select-choices {
    margin-top: 1px;
  }
  .ui-select-choices-row>a {
      display: block;
      padding: 3px 20px;
      clear: both;
      font-weight: 400;
      line-height: 1.42857143;
      color: #333;
      white-space: nowrap;
  }
  .ui-select-action {
      padding: 3px 20px;
  }
  .ui-select-action .fa {
      float: right;
  }
  .ui-select-choices-row.active>a {
      color: #fff;
      text-decoration: none;
      outline: 0;
      background-color: #428bca;
  }
  
  .ui-select-multiple {
    height: auto;
    padding:3px 3px 0 3px;
  }
  
  .ui-select-multiple input.ui-select-search {
    background-color: transparent !important; /* To prevent double background when disabled */
    border: none;
    outline: none;
    box-shadow: none;
    height: 1.6666em;
    padding: 0;
    margin-bottom: 3px;
    
  }
  .ui-select-match .close {
      font-size: 1.6em;
      line-height: 0.75;
  }
  
  .ui-select-multiple .ui-select-match-item {
    outline: 0;
    margin: 0 3px 3px 0;
  }
  .ui-select-toggle > .caret {
      position: absolute;
      height: 10px;
      top: 50%;
      right: 10px;
      margin-top: -2px;
  }
`;

@Component({
  selector: 'app-select',
  styles: [styles],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable */
      useExisting: forwardRef(() => SelectComponent),
      /* tslint:enable */
      multi: true
    }
  ],
  template: `
    <template #actionTemplate>
      <li *ngFor="let action of actions; let index=index" role="menuitem">
        <div class="ui-select-action "
             (click)="actionClick(action, $event)">
          {{ action.text }}<span *ngIf="action.actionIconCls" class="{{action.actionIconCls}}"></span>
        </div>
      </li>
    </template>
    
    <div tabindex="0"
         *ngIf="multiple === false"
         (keyup)="mainClick($event)"
         [offClick]="clickedOutside"
         class="ui-select-container dropdown open">
      <div [ngClass]="{'ui-disabled': disabled}"></div>
      <div class="ui-select-match"
           *ngIf="!inputMode">
      <span tabindex="-1"
            class="btn btn-default btn-secondary form-control ui-select-toggle"
            (click)="matchClick($event)"
            style="outline: 0;">
        <span *ngIf="active.length <= 0" class="ui-select-placeholder text-muted">{{placeholder}}</span>
        <span *ngIf="active.length > 0" class="ui-select-match-text pull-left"
              [ngClass]="{'ui-select-allow-clear': allowClear && active.length > 0}"
              [innerHTML]="sanitize(active[0].text)"></span>
        <i class="dropdown-toggle pull-right"></i>
        <i class="caret pull-right"></i>
        <a *ngIf="allowClear && active.length>0" class="btn btn-xs btn-link pull-right" 
           style="margin-right: 10px; padding: 0;" (click)="removeClick(active[0], $event)">
           <i class="glyphicon glyphicon-remove"></i>
        </a>
      </span>
      </div>
      <input type="text" autocomplete="false" tabindex="-1"
             (keydown)="inputEvent($event)"
             (keyup)="inputEvent($event, true)"
             [disabled]="disabled"
             [attr.readonly]="readonly"
             class="form-control ui-select-search"
             *ngIf="inputMode"
             placeholder="{{active.length <= 0 ? placeholder : ''}}">
      <!-- options template -->
      <ul *ngIf="optionsOpened && options && options.length > 0 && !firstItemHasChildren"
          class="ui-select-choices dropdown-menu" role="menu">
        <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
        <li *ngFor="let o of options" role="menuitem">
          <div class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)">
            <a href="javascript:void(0)" class="dropdown-item">
              <div [innerHtml]="sanitize(o.text | highlight:inputValue)"></div>
            </a>
          </div>
        </li>
      </ul>

      <ul *ngIf="optionsOpened && options && options.length > 0 && firstItemHasChildren"
          class="ui-select-choices dropdown-menu" role="menu">
        <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
        <li *ngFor="let c of options; let index=index" role="menuitem">
          <div class="divider dropdown-divider" *ngIf="index > 0"></div>
          <div class="dropdown-header">{{c.text}}</div>

          <div *ngFor="let o of c.children"
               class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)"
               [ngClass]="{'active': isActive(o)}">
            <a href="javascript:void(0)" class="dropdown-item">
              <div [innerHtml]="sanitize(o.text | highlight:inputValue)"></div>
            </a>
          </div>
        </li>
      </ul>
    </div>

    <div tabindex="0"
         *ngIf="multiple === true"
         (keyup)="mainClick($event)"
         (focus)="focusToInput('')"
         [offClick]="clickedOutside"
         class="ui-select-container ui-select-multiple dropdown form-control open">
      <div [ngClass]="{'ui-disabled': disabled}"></div>
      <span class="ui-select-match">
        <span *ngFor="let a of active">
            <span class="ui-select-match-item btn btn-default btn-secondary btn-xs"
                  tabindex="-1"
                  type="button"
                  [ngClass]="{'btn-default': true}">
               <a class="close"
                  style="margin-left: 5px; padding: 0;"
                  (click)="removeClick(a, $event)">&times;</a>
               <span [innerHtml]="sanitize(a.text)"></span>
           </span>
        </span>
    </span>
      <input type="text"
             (keydown)="inputEvent($event)"
             (keyup)="inputEvent($event, true)"
             (click)="matchClick($event)"
             [disabled]="disabled"
             [attr.readonly]="readonly"
             autocomplete="false"
             autocorrect="off"
             autocapitalize="off"
             spellcheck="false"
             class="form-control ui-select-search"
             placeholder="{{active.length <= 0 ? placeholder : ''}}"
             role="combobox">
      <!-- options template -->
      <ul *ngIf="optionsOpened && options && options.length > 0 && !firstItemHasChildren"
          class="ui-select-choices dropdown-menu" role="menu">
        <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
        <li *ngFor="let o of options" role="menuitem">
          <div class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)">
            <a href="javascript:void(0)" class="dropdown-item">
              <div [innerHtml]="sanitize(o.text | highlight:inputValue)"></div>
            </a>
          </div>
        </li>
      </ul>

      <ul *ngIf="optionsOpened && options && options.length > 0 && firstItemHasChildren"
          class="ui-select-choices dropdown-menu" role="menu">
        <ng-container *ngTemplateOutlet="actionTemplate"></ng-container>
        <li *ngFor="let c of options; let index=index" role="menuitem">
          <div class="divider dropdown-divider" *ngIf="index > 0"></div>
          <div class="dropdown-header">{{c.text}}</div>

          <div *ngFor="let o of c.children"
               class="ui-select-choices-row"
               [class.active]="isActive(o)"
               (mouseenter)="selectActive(o)"
               (click)="selectMatch(o, $event)"
               [ngClass]="{'active': isActive(o)}">
            <a href="javascript:void(0)" class="dropdown-item">
              <div [innerHtml]="sanitize(o.text | highlight:inputValue)"></div>
            </a>
          </div>
        </li>
      </ul>
    </div>
  `
})
export class SelectComponent implements OnInit, AfterViewChecked, ControlValueAccessor, ISelectComponent {
  @Input() public allowClear = false;
  @Input() public readonly = true;
  @Input() public placeholder = '';
  @Input() public idField = 'id';
  @Input() public textField = 'text';
  @Input() public childrenField = 'children';
  @Input() public multiple = false;
  @Input() public actions: Array<ISelectionAction> = [];
  @Input() public lazyItems: Observable<Array<any>>;
  @Input() public cachingItems = false;
  @Output() public clickAction: EventEmitter<ISelectionAction> = new EventEmitter();

  private _lazyItemsSubscription: Subscription;
  private _selectActionHandler: SelectActionHandler;

  @Input()
  public set items(value: Array<any>) {
    this.initItems(value);
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set active(selectedItems: Array<any>) {
    if (!selectedItems || selectedItems.length === 0) {
      this._active = [];
    } else {
      const areItemsStrings = typeof selectedItems[0] === 'string';

      this._active = selectedItems.map((item: any) => {
        const data = areItemsStrings
          ? item
          : {id: item[this.idField], text: item[this.textField]};

        return new SelectItem(data, this.idField, this.textField);
      });
    }
  }

  @Output() public data: EventEmitter<any> = new EventEmitter();
  @Output() public selected: EventEmitter<any> = new EventEmitter();
  @Output() public removed: EventEmitter<any> = new EventEmitter();
  @Output() public typed: EventEmitter<any> = new EventEmitter();
  @Output() public opened: EventEmitter<any> = new EventEmitter();

  public options: Array<SelectItem> = [];
  public itemObjects: Array<SelectItem> = [];
  public activeOption: SelectItem;
  public element: ElementRef;

  protected onChange: any = Function.prototype;
  protected onTouched: any = Function.prototype;

  private inputMode = false;
  private _optionsOpened = false;
  private behavior: OptionsBehavior;
  private inputValue = '';
  private _items: Array<any> = [];
  private _disabled = false;
  private _active: Array<SelectItem> = [];

  public get active(): Array<any> {
    return this._active;
  }

  private set optionsOpened(value: boolean){
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  private initItems(value: Array<any>): void {
    if (!value) {
      this._items = this.itemObjects = [];
    } else {
      this._items = value.filter((item: any) => {
        if ((typeof item === 'string') || (typeof item === 'object' && item && item[this.textField] && item[this.idField])) {
          return item;
        }
      });
      this.itemObjects = this._items.map((item: any) => (typeof item === 'string'
        ? new SelectItem(item, this.idField, this.textField)
        : new SelectItem({
          id: item[this.idField],
          text: item[this.textField],
          children: item[this.childrenField]}, this.idField, this.textField
        )));
    }
  }

  private initLazyItems(): void {
    if (this.cachingItems && this._lazyItemsSubscription) {
      return;
    }
    this._lazyItemsSubscription = this.lazyItems.subscribe((value: Array<any>) => {
      this.initItems(value);
      this.afterInitItems();
    });
  }

  private get optionsOpened(): boolean{
    return this._optionsOpened;
  }

  public constructor(element: ElementRef,
                     private sanitizer: DomSanitizer,
                     private renderer: Renderer2) {
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
    if (!isUpMode && e.keyCode === 37 && this._items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this._items.length > 0) {
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

  /**
   * @override
   */
  public ngOnInit(): void {
    this.behavior = (this.firstItemHasChildren) ?
      new ChildrenBehavior(this) : new GenericBehavior(this);
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
    return this.itemObjects[0] && this.itemObjects[0].hasChildren();
  }

  public writeValue(val: any): void {
    this.active = val;
    this.data.emit(this.active);
  }

  public registerOnChange(fn:(_:any) => {}):void {this.onChange = fn;}
  public registerOnTouched(fn:() => {}):void {this.onTouched = fn;}

  protected matchClick(e:any):void {
    if (this._disabled === true) {
      return;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      this.open();
    }
  }

  protected  mainClick(event:any):void {
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

  protected  selectActive(value:SelectItem):void {
    this.activeOption = value;
  }

  protected  isActive(value:SelectItem):boolean {
    return this.activeOption.id === value.id;
  }

  protected removeClick(value: SelectItem, event: any): void {
    event.stopPropagation();
    this.remove(value);
  }

  private focusToInput(value:string = ''):void {
    setTimeout(() => {
      let el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
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

  private selectMatch(value:SelectItem, e:Event = void 0):void {
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

  public fillOptionsMap():void {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.itemObjects
      .map((item:SelectItem) => {
        startPos = item.fillChildrenHash(this.optionsMap, startPos);
      });
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

  private getActiveIndex(optionsMap:Map<string, number> = void 0):number {
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

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor:SelectComponent) {
    super(actor);
  }

  public first():void {
    this.actor.activeOption = this.actor.options[0].children[0];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last():void {
    this.actor.activeOption =
      this.actor
        .options[this.actor.options.length - 1]
        .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev():void {
    let indexParent = this.actor.options
      .findIndex((option:SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id);
    let index = this.actor.options[indexParent].children
      .findIndex((option:SelectItem) => this.actor.activeOption && this.actor.activeOption.id === option.id);
    this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent - 1]) {
        this.actor.activeOption = this.actor
          .options[indexParent - 1]
          .children[this.actor.options[indexParent - 1].children.length - 1];
      }
    }
    if (!this.actor.activeOption) {
      this.last();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public next():void {
    let indexParent = this.actor.options
      .findIndex((option:SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.id === option.id);
    let index = this.actor.options[indexParent].children
      .findIndex((option:SelectItem) => this.actor.activeOption && this.actor.activeOption.id === option.id);
    this.actor.activeOption = this.actor.options[indexParent].children[index + 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent + 1]) {
        this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
      }
    }
    if (!this.actor.activeOption) {
      this.first();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public filter(query:RegExp):void {
    let options:Array<SelectItem> = [];
    let optionsMap:Map<string, number> = new Map<string, number>();
    let startPos = 0;
    for (let si of this.actor.itemObjects) {
      let children:Array<SelectItem> = si.children.filter((option:SelectItem) => query.test(option.text));
      startPos = si.fillChildrenHash(optionsMap, startPos);
      if (children.length > 0) {
        let newSi = si.getSimilar();
        newSi.children = children;
        options.push(newSi);
      }
    }
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0].children[0];
      super.ensureHighlightVisible(optionsMap);
    }
  }
}
