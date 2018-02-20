import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { IOption } from '@app/core/converter/value-converter.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DropdownDirective } from '../../../dropdown/dropdown.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-single-select',
  styleUrls: [ './single-select.component.scss' ],
  templateUrl: './single-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectComponent),
      multi: true
    }
  ],
})
export class SingleSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() isDisabled = false;
  @Input() lookupKey: ILookupKey;
  @Input() nullable = false;

  @ViewChild(DropdownDirective) dropdown: DropdownDirective;

  private _options: IOption[];
  private _optionsSubscription: Subscription;
  private _value: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  @Input()
  set options(options: IOption[]) {
    this._options = options;
    this.cdRef.markForCheck();
  }

  get options(): IOption[] {
    return this._options;
  }

  get label(): string {
    const option = (this.options || []).find(o => o.value === this._value);
    return option ? option.label : null;
  }

  ngOnInit(): void {
    if (!this.dictCode === !this.lookupKey) {
      throw new Error('SingleSelectComponent must have either dictCode or lookupKey but not both.');
    }
    if (this.dictCode) {
      this._optionsSubscription = this.userDictionariesService.getDictionaryAsOptions(this.dictCode)
        .subscribe(this.onOptionsFetch);
    }
    if (this.lookupKey) {
      this._optionsSubscription = this.lookupService.lookupAsOptions(this.lookupKey)
        .subscribe(this.onOptionsFetch);
    }
    this.setDisabledState(this.isDisabled);
  }

  ngOnDestroy(): void {
    if (this._optionsSubscription) {
      this._optionsSubscription.unsubscribe();
    }
  }

  getId = (option: IOption) => option.value;
  getName = (option: IOption) => option.label;

  onSelect(item: IOption): void {
    this.value = <number>item.value;
    this.propagateChange(this._value);
    this.dropdown.close();
  }

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  private set value(value: number) {
    this._value = value;
    this.cdRef.markForCheck();
  }

  private onOptionsFetch = (options: IOption[]) => {
    this.options = options;
  }

  private propagateChange: Function = () => {};
}
