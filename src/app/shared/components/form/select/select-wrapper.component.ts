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

import { ILookupKey } from '../../../../core/lookup/lookup.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';

import { LookupService } from '../../../../core/lookup/lookup.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-select-wrapper',
  templateUrl: 'select-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectWrapperComponent),
      multi: true
    }
  ],
})
export class SelectWrapperComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() dictCode: number;
  @Input() lookupKey = null as ILookupKey;

  constructor(
    private cdRef: ChangeDetectorRef,
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  private _disabled = false;
  private _value: any;
  private _options: IOption[];

  private _optionsSubscription: Subscription;

  get disabled(): boolean {
    return this._disabled;
  }

  get value(): any {
    return this._value;
  }

  get options(): IOption[] {
    return this._options;
  }

  ngOnInit(): void {
    if (!this.dictCode === !this.lookupKey) {
      throw new Error('SelectWrapperComponent must have either dictCode or lookupKey but not both.');
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

  writeValue(value: any): void {
    this._value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(cb: Function): void {
    this.propagateChange = cb;
  }

  registerOnTouched(): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cdRef.markForCheck();
  }

  onChange(value: any): void {
    this._value = value;
    this.propagateChange(value);
  }

  onOptionsFetch = (options: IOption[]) => {
    this._options = options;
    this.cdRef.markForCheck();
  }

  private propagateChange: Function;
}
