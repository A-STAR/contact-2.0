import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';
import * as moment from 'moment';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

import { minStrict, max } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-payment',
  templateUrl: 'payment.component.html'
})
export class ContactRegistrationPaymentComponent {
  @Input() formGroup: FormGroup;

  private limitInfo$ = combineLatest(
    this.contactRegistrationService.debt$.pipe(filter(Boolean)),
    this.contactRegistrationService.limit$.pipe(filter(Boolean)),
    this.contactRegistrationService.canSetInsufficientPromiseAmount$,
  );

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && [2, 3].includes(outcome.paymentMode))
    );
  }

  get today(): Date {
    return moment().toDate();
  }

  get paymentMinAmount$(): Observable<number> {
    return this.limitInfo$.pipe(
      map(([ debt, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
    );
  }

  get paymentMaxAmount$(): Observable<number> {
    return this.limitInfo$.pipe(
      map(([ debt ]) => debt.debtAmount),
    );
  }

  get paymentMinPercentage$(): Observable<number> {
    return this.limitInfo$.pipe(
      map(([ _, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent),
    );
  }

  get isPaymentAmountDisabled$(): Observable<boolean> {
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => !outcome || outcome.paymentMode !== 3),
    );
  }

  onPaymentAmountInput(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const amount = Number(value);
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPaymentAmount(amount, 100.0 * amount / debt.debtAmount));
  }

  onPaymentPercentageInput(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const percentage = Number(value);
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPaymentAmount(debt.debtAmount * percentage / 100.0, percentage));
  }

  private setPaymentAmount(amount: number, percentage: number): void {
    this.formGroup.patchValue({ payment: { amount, percentage } });
    this.cdRef.markForCheck();
  }
}
