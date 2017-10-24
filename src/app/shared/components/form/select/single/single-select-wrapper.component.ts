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

@Component({
  selector: 'app-single-select-wrapper',
  templateUrl: 'single-select-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectWrapperComponent),
      multi: true
    }
  ],
})
export class SingleSelectWrapperComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() lookupKey = null as ILookupKey;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  private _value: number;
  private _options: IOption[];

  private _optionsSubscription: Subscription;

  get value(): number {
    return this._value;
  }

  get options(): IOption[] {
    return this._options;
  }

  ngOnInit(): void {
    if (!this.dictCode === !this.lookupKey) {
      throw new Error('SingleSelectWrapperComponent must have either dictCode or lookupKey but not both.');
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

  writeValue(value: number): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(cb: Function): void {
    this.propagateChange = cb;
  }

  registerOnTouched(): void {
  }

  onChange(value: number): void {
    this._value = value;
    this.propagateChange(value);
  }

  onOptionsFetch = (options: IOption[]) => {
    this._options = options;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function;
}
