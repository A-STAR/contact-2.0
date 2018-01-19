import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { floor, round } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DebtAmountComponent),
      multi: true,
    }
  ],
  selector: 'app-debt-amount',
  styleUrls: [ './debt-amount.component.scss' ],
  templateUrl: './debt-amount.component.html',
})
export class DebtAmountComponent implements ControlValueAccessor {
  private _amount: number;
  private _total: number;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  /*
   * TODO(d.maltsev):
   * `amount` and `percentage` getters don't seem to update properly on invalid value input.
   */

  get amount(): string {
    return this._amount
      ? this._amount.toString()
      : '';
  }

  get percentage(): string {
    return this._amount
      ? round(100 * this._amount / this._total, 2).toString()
      : '';
  }

  get total(): number {
    return this._total;
  }

  @Input('total')
  set total(total: number) {
    this._total = total;
    this.cdRef.markForCheck();
  }

  writeValue(amount: number): void {
    this._amount = amount;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  onAmountChange(event: Event): void {
    const amount = this.getValueFromEvent(event);
    this.setAmount(amount);
  }

  onPercentageChange(event: Event): void {
    const amount = this.getValueFromEvent(event) * this._total / 100;
    this.setAmount(amount);
  }

  onTouch(): void {
    this.propagateTouch();
  }

  private setAmount(amount: number): void {
    const min = 0;
    const max = floor(this._total, 2);
    const nextAmount = Math.max(min, Math.min(max, round(amount, 2))) || null;
    this._amount = nextAmount;
    this.propagateChange(nextAmount);
    this.cdRef.markForCheck();
  }

  private getValueFromEvent(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
