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
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import * as R from 'ramda';
import { Subscription } from 'rxjs/Subscription';

import { ILabeledValue } from '../select.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { SortOptionsPipe } from '@app/shared/components/form/select/select.pipe';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

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
export class SelectComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  @ViewChild('input') input: ElementRef;

  @Input() dictCode: number;
  @Input() errors: ValidationErrors;
  @Input() label: string;
  @Input() lookupKey: ILookupKey;
  @Input() placeholder = '';
  @Input() renderer: (option: ILabeledValue) => void;
  @Input() styles: CSSStyleDeclaration;

  @Output() select = new EventEmitter<any>();

  public open = false;

  private _active: ILabeledValue;
  private _autoAlign = false;
  // private _autocomplete: ILabeledValue[] = [];
  private _disabled = false;
  private _options: ILabeledValue[];
  private _required = false;
  private optionsSubscription: Subscription;
  private selectedValue: number = null;

  @Input()
  set options(options: ILabeledValue[]) {
    this._options = this.sortOptionsPipe.transform(options);
    this.writeValue(this.selectedValue);
  }

  get options(): ILabeledValue[] {
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
  set isRequired(value: boolean) {
    this._required = this.setDefault(value, this._required);
  }

  get required(): boolean {
    return this._required;
  }

  // NOTE: active used to be an input (for compat reasons),
  // so it may not really be necessary
  set active(option: ILabeledValue) {
    this._active = option;
  }

  get active(): ILabeledValue {
    return this._active;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private renderer2: Renderer2,
    private sortOptionsPipe: SortOptionsPipe,
    private userDictionariesService: UserDictionariesService,
  ) {
    this.hideOptions = this.hideOptions.bind(this);
    this.renderer = (option: ILabeledValue) => option.label;
  }

  ngOnInit(): void {
    if (this.dictCode && this.lookupKey) {
      throw new Error('SelectComponent must have either dictCode or lookupKey but not both.');
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
    if (!this.input.nativeElement.contains(event.target) && this.open) {
      this.hideOptions();
    }
  }

  writeValue(id: number): void {
    this.selectedValue = id;
    if (id != null && this.options.length) {
      this.active = this.selectedOption;
    }
    this.renderer2.setProperty(this.input.nativeElement, 'value', this.activeLabel);
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

  validate(): ValidationErrors {
    // TODO(i.lobanov): fix this horrible check
    return this.required && (this.selectedValue == null || (this.selectedValue as any) === '')
      ? { required: false }
      : null;
  }

  get activeLabel(): string {
    return this.selectedValue !== null && this.active
      ? this.active.label || ''
      : '';
  }

  get selectedOption(): ILabeledValue {
    return this.options.find(v => v.value === this.selectedValue);
  }

  get caretCls(): string {
    return this.open ? 'up' : '';
  }

  onInputClick(): void {
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
    const option = this.options.find(o => o.label === label);
    this.selectedValue = option ? option.value : null;
    this.propagateChange(this.selectedValue);
  }

  onSelect(event: Event, option: ILabeledValue): void {
    event.stopPropagation();
    event.preventDefault();

    this.selectedValue = option.value;
    this.active = option;
    this.propagateChange(option.value);
    this.select.emit(option.value);

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
      this.showOptions();
    }
  }

  isActive(option: ILabeledValue): boolean {
    return this.selectedValue === option.value;
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

  private onOptionsFetch = (options: ILabeledValue[]) => {
    this.options = options;
    this.active = this.selectedOption;
    this.cdRef.markForCheck();
  }
}
