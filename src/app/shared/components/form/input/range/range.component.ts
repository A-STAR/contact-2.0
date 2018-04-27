import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  HostBinding,
} from '@angular/core';

import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
} from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { defaultTo } from 'ramda';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
  ],
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss'],
})
export class RangeComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() min: number;
  @Input() max: number;
  @Input() label: string;
  @Input() required = false;
  @Input() errors: any;
  @Input() debounce: number;

  @Input()
  set isReadonly(value: boolean) {
    this.readonly = this.setDefault(value, this.readonly);
    this.required = this.readonly ? false : this.required;
  }

  @Input()
  set isDisabled(value: boolean) {
    this.disabled = this.setDefault(value, this.disabled);
    this.required = this.disabled ? false : this.required;
  }

  disabled = false;
  readonly = false;
  value: number;
  private debounce$ = new Subject<number>();
  private debounceSub: Subscription;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.debounce) {
      this.debounceSub = this.debounce$
        .debounceTime(this.debounce)
        .subscribe(value => this.update(value));
    }
  }

  ngOnDestroy(): void {
    if (this.debounceSub) {
      this.debounceSub.unsubscribe();
    }
  }

  writeValue(value: number): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  onChange(value: string): void {
    const valueAsNumber = value === '' ? null : Number(value);
    const newValue = isNaN(valueAsNumber) ? null : valueAsNumber;

    this.debounce ? this.debounce$.next(newValue) : this.update(newValue);
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_: Function): void {
    // this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  validate(): any {
    switch (true) {
      case this.required && this.value == null:
        return { required: true };
      default:
        return null;
    }
  }

  private setDefault(value: boolean, defaultValue: boolean): boolean {
    return defaultTo(defaultValue)(value);
  }

  private update(value: number): void {
    this.value = value;
    this.propagateChange(value);
    this.cdRef.markForCheck();
  }

  private propagateChange: Function = () => {};
  // private propagateTouch: Function = () => {};
}
