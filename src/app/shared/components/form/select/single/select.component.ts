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
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { ILabeledValue } from '../select.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';
import { IUserPermission } from '@app/core/user/permissions/user-permissions.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { SortOptionsPipe } from '@app/shared/components/form/select/select.pipe';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DropdownDirective } from '@app/shared/components/dropdown/dropdown.directive';

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
  @Input() dictCode: number;
  @Input() errors: ValidationErrors;
  @Input() filterByPermission: string;
  @Input() label: string;
  @Input() lookupKey: ILookupKey;
  @Input() placeholder = '';
  @Input() renderer: (option: ILabeledValue) => void;
  @Input() styles: CSSStyleDeclaration;

  @Output() select = new EventEmitter<any>();

  @ViewChild('input') input: ElementRef;
  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _active: ILabeledValue;
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
  set isDisabled(value: boolean) {
    this._disabled = this.setDefault(value, this._disabled);

    if (this._disabled) {
      this.dropdown.close();
    }
    this.setDisabledState(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set isRequired(value: boolean) {
    this._required = this.setDefault(value, this._required);
    this.isNullable = !this._required;
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
    private userPermissionsService: UserPermissionsService,
  ) {
    this.renderer = (option: ILabeledValue) => option.label;
  }

  isNullable = false;

  ngOnInit(): void {
    if (this.dictCode && this.lookupKey) {
      throw new Error('SelectComponent must have either dictCode or lookupKey but not both.');
    }
    if (this.dictCode) {
      this.optionsSubscription = combineLatest(
        this.userDictionariesService.getDictionaryAsOptions(this.dictCode),
        this.filterByPermission
          ? this.userPermissionsService.get([ this.filterByPermission ])
          : of(null),
      )
      .subscribe(([ options, permissions ]) => this.onOptionsFetch(options, permissions));
    }
    if (this.lookupKey) {
      this.optionsSubscription = combineLatest(
        this.lookupService.lookupAsOptions(this.lookupKey),
        this.filterByPermission
          ? this.userPermissionsService.get([ this.filterByPermission ])
          : of(null),
      )
      .subscribe(([ options, permissions ]) => this.onOptionsFetch(options, permissions));
    }
    this.setDisabledState(this.disabled);
  }

  ngOnDestroy(): void {
    if (this.optionsSubscription) {
      this.optionsSubscription.unsubscribe();
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
    return this.required && ['', null, undefined].includes(this.selectedValue as any)
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
    return this.dropdown.opened ? 'up' : '';
  }

  onDropdownToggle(): void {
    this.cdRef.markForCheck();
  }

  onSelect(event: Event, option: ILabeledValue): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.isClosed(option)) {
      return;
    }

    this.selectedValue = option.value;
    this.active = option;
    this.propagateChange(option.value);
    this.select.emit(option.value);

    this.dropdown.close();
    this.cdRef.markForCheck();
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.active = null;
    this.propagateChange(null);
  }

  isActive(option: ILabeledValue): boolean {
    return this.selectedValue === option.value;
  }

  isClosed(option: ILabeledValue): boolean {
    return option.isClosed === 1;
  }

  propagateTouched: Function = () => {};

  private propagateChange: Function = () => {};

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return R.defaultTo(defaultValue)(value);
  }

  private onOptionsFetch = (options: ILabeledValue[], permissions: IUserPermission[]) => {
    this.options = this.filterOptions(options, permissions ? permissions[0] : null);
    this.active = this.selectedOption;
    this.cdRef.markForCheck();
  }

  private filterOptions(options: ILabeledValue[], permission: IUserPermission): ILabeledValue[] {
    if (!permission || permission.valueS === 'ALL') {
      return options;
    }
    if (!permission.valueS) {
      return [];
    }
    const values = permission.valueS.split(/,\s*/);
    return options.filter(option => values.includes(String(option.value)));
  }
}
