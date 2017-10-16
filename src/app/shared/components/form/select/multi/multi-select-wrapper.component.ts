import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { ILookupKey } from '../../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { LookupService } from '../../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

type IMultiSelectValue = Array<number | string>;

@Component({
  selector: 'app-multi-select-wrapper',
  templateUrl: 'multi-select-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectWrapperComponent),
      multi: true
    }
  ],
})
export class MultiSelectWrapperComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() lookupKey = null as ILookupKey;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  private _value: IMultiSelectValue;
  private _options: IOption[];

  private _optionsSubscription: Subscription;

  get value(): IMultiSelectValue {
    return this._value;
  }

  get options(): IOption[] {
    return this._options;
  }

  ngOnInit(): void {
    if (!this.dictCode === !this.lookupKey) {
      throw new Error('MultiSelectWrapperComponent must have either dictCode or lookupKey but not both.');
    }
    if (this.dictCode) {
      this._optionsSubscription = this.userDictionariesService.getDictionaryAsOptions(this.dictCode)
        .subscribe(this.onOptionsFetch);
    }
    if (this.lookupKey) {
      this._optionsSubscription = this.lookupService.lookupAsOptions(this.lookupKey)
        .subscribe(this.onOptionsFetch);
    }
  }

  ngOnDestroy(): void {
    if (this._optionsSubscription) {
      this._optionsSubscription.unsubscribe();
    }
  }

  writeValue(value: IMultiSelectValue): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(cb: Function): void {
    this.propagateChange = cb;
  }

  registerOnTouched(): void {
  }

  onChange(value: IMultiSelectValue): void {
    this._value = value;
    this.propagateChange(value);
  }

  onOptionsFetch = (options: IOption[]) => {
    this._options = options;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function;
}
