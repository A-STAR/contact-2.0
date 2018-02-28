import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
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
import { Subscription } from 'rxjs/Subscription';

import { IMultiSelectOption } from '../select.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { SortOptionsPipe } from '@app/shared/components/form/select/select.pipe';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-multi-select',
  styleUrls: ['./multi-select.component.scss'],
  templateUrl: './multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @ViewChild('input') input: ElementRef;
  @ViewChild('list') list: ElementRef;

  @Input() dictCode: number;
  @Input() errors: ValidationErrors;
  @Input() label: string;
  @Input() lookupKey: ILookupKey;
  @Input() placeholder = '';
  @Input() styles: CSSStyleDeclaration;

  @Output() select = new EventEmitter<any>();

  public open = false;

  private _active: IMultiSelectOption;
  private _autoAlign = false;
  private _disabled = false;
  private _options: IMultiSelectOption[];
  private _required = false;
  private optionsSubscription: Subscription;
  private selection: number[] = [];

  @Input()
  set options(options: IMultiSelectOption[]) {
    this._options = <IMultiSelectOption[]>this.sortOptionsPipe
      .transform(<IMultiSelectOption[]>options)
      .map(o => ({ ...o, checked: false }));
    this.writeValue(this.selection);
  }

  get options(): IMultiSelectOption[] {
    return this._options || [];
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
    this.setDisabledState(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set required(value: boolean) {
    this._required = this.setDefault(value, this._required);
  }

  get required(): boolean {
    return this._required;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private renderer2: Renderer2,
    private sortOptionsPipe: SortOptionsPipe,
    private userDictionariesService: UserDictionariesService,
  ) {
    this.hideOptions = this.hideOptions.bind(this);
  }

  ngOnInit(): void {
    if (this.dictCode && this.lookupKey) {
      throw new Error('MultiSelectComponent must have either dictCode or lookupKey but not both.');
    }
    if (this.dictCode) {
      this.optionsSubscription = this.userDictionariesService.getDictionaryAsOptions(this.dictCode)
        .subscribe(this.onOptionsFetch);
    }
    if (this.lookupKey) {
      this.optionsSubscription = this.lookupService.lookupAsOptions(this.lookupKey)
        .subscribe(this.onOptionsFetch);
    }
    this.setDisabledState(this.disabled);
  }

  ngOnDestroy(): void {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open
      && !this.input.nativeElement.contains(event.target)
      && this.list
      && !this.list.nativeElement.contains(event.target)) {
      this.hideOptions();
    }
  }

  writeValue(ids: number[]): void {
    // console.log('write', ids);
    if (ids != null && ids.length && this.options.length) {
      // this.selection = Array.from(new Set([...this.selection, ...ids]));
      this.selection = Array.from(new Set([...ids]));
      // Chose forEach, otherwise would run out of stack
      this.options.forEach(o => {
        o.checked = this.selection.includes(o.value);
      });
    }
    this.propagateChange(this.selection);
    this.renderer2.setProperty(this.input.nativeElement, 'value', this.selectionLabel);
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
    this.renderer2.setProperty(this.input.nativeElement, 'disabled', disabled);
    this.cdRef.markForCheck();
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.required && !this.selection.length
      ? { required: false }
      : null;
  }

  get hasSelection(): boolean {
    return !!this.selection.length;
  }

  get selectionLabel(): string {
    const length = this.selection.length;
    switch (length) {
      case 0:
        return 'No items selected';
      case 1: {
        const option = this.options.find(o => o.value === this.selection[0]);
        return `${option ? option.label : ''}`;
      }
      default:
        return `${length} items selected`;
    }
  }

  get caretCls(): string {
    return this.open ? 'up' : '';
  }

  onInputClick(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    if (!this.open) {
      this.showOptions();
    } else {
      this.hideOptions();
    }
  }

  onInputChange(label: string): void {
    this.propagateChange(this.selection);
  }

  onSelect(checked: boolean, option: IMultiSelectOption): void {
    option.checked = checked;
    this.selection = checked
      ? Array.from(new Set([...this.selection, option.value ]))
      : this.selection.filter(o => o !== option.value);
    this.propagateChange(this.selection);
    this.select.emit(option);
  }

  onClose(event: MouseEvent): void {
    event.preventDefault();
    this.hideOptions();
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    this.selection = [];
    this.options = this.options.map(o => ({ ...o, checked: false }));
    this.propagateChange([]);
  }

  onCaret(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.open) {
      this.hideOptions();
    } else {
      this.showOptions();
    }
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

  private onOptionsFetch = (options: IMultiSelectOption[]) => {
    this.options = options;
    this.propagateChange(this.selection);
    this.cdRef.markForCheck();
  }

}
