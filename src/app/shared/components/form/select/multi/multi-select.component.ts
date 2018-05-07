import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
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
import { TranslateService } from '@ngx-translate/core';

import { IMultiSelectOption } from '../select.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { SortOptionsPipe } from '@app/shared/components/form/select/select.pipe';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

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
  @Input() dictCode: number;
  @Input() errors: ValidationErrors;
  @Input() label: string;
  @Input() lookupKey: ILookupKey;
  @Input() placeholder = '';
  @Input() styles: CSSStyleDeclaration;

  @Output() select = new EventEmitter<number[]>();

  @ViewChild('input') input: ElementRef;
  @ViewChild('list') list: ElementRef;
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  open = false;
  disabled = false;
  tempOptions: IMultiSelectOption[] = [];

  private _options: IMultiSelectOption[];
  private _required = false;
  private optionsSubscription: Subscription;
  private value: number[] = [];
  private tempValue: number[] = [];

  @Input()
  set options(options: IMultiSelectOption[]) {
    this._options = <IMultiSelectOption[]>this.sortOptionsPipe
      .transform(<IMultiSelectOption[]>options)
      .map(o => ({ ...o, checked: this.value.includes(o.value) }));

    // Filter out value not found in options
    this.value = this.value.filter(v => this.options.some(o => o.value === v));
    this.cdRef.markForCheck();
  }

  get options(): IMultiSelectOption[] {
    return this._options || [];
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
    private renderer: Renderer2,
    private sortOptionsPipe: SortOptionsPipe,
    private translate: TranslateService,
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
  }

  ngOnDestroy(): void {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
    }
  }

  writeValue(value: number[]): void {
    if (!Array.isArray(value)) {
      return;
    }

    const filterFn = this.options.length
      ? (v) => this.options.some(o => o.value === v)
      : (v) => v;

    // Filter out values not found in options
    this.value = Array.from(new Set([...value]))
      .filter(filterFn);
    // Update the `checked` prop of every option
    if (this.options.length) {
      this.options = this.options.map(o => ({ ...o, checked: this.value.includes(o.value) }));
    } else {
      this.cdRef.markForCheck();
    }
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdRef.markForCheck();
  }

  validate(): ValidationErrors {
    return this.required && !this.value.length
      ? { required: false }
      : null;
  }

  get hasSelection(): boolean {
    return !!this.value.length;
  }

  get selectionLabel(): string {
    const length = this.value.length;
    switch (length) {
      case 0:
        return '';
      case 1: {
        const option = this.options.find(o => o.value === this.value[0]);
        return `${option ? option.label : ''}`;
      }
      default:
        const say = this.translate.instant('default.select.selected');
        return `${say}: ${length}`;
    }
  }

  onInputChange(): void {
    this.renderer.setProperty(this.input.nativeElement, 'value', this.selectionLabel);
  }

  onSelect(checked: boolean, option: IMultiSelectOption): void {
    option.checked = checked;
    this.tempValue = checked
      ? Array.from(new Set([...this.tempValue, option.value ]))
      : this.tempValue.filter(o => o !== option.value);
  }

  onApply(event: MouseEvent): void {
    event.preventDefault();
    this.hideOptions();
    this.value = [...this.tempValue];
    this.options = [...this.tempOptions];
    this.propagateChange(this.value);
    this.select.emit(this.value);
    this.cdRef.markForCheck();
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    this.hideOptions();
    this.value = [];
    this.options = this.tempOptions.map(o => ({ ...o, checked: false }));
    this.propagateChange(this.value);
    this.select.emit(this.value);
    this.cdRef.markForCheck();
  }

  trackByFn(option: IMultiSelectOption): number {
    return option.value;
  }

  onDropdownToggle(open: boolean): void {
    if (open) {
      // Copy source values and options before editing
      this.tempValue = [...this.value];
      this.tempOptions = this.options.map(o => ({ ...o }));
      this.open = true;
    }
    this.cdRef.markForCheck();
  }

  propagateTouched: Function = () => {};

  private propagateChange: Function = () => {};

  private hideOptions(): void {
    this.dropdown.close();
    this.propagateTouched();
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return R.defaultTo(defaultValue)(value);
  }

  private onOptionsFetch = (options: IMultiSelectOption[]) => {
    this.options = options;
  }
}
