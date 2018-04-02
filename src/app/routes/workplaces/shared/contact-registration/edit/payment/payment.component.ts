import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';
import * as moment from 'moment';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

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

  readonly canDisplayForm$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && [2, 3].includes(outcome.paymentMode))
  );

  get today(): Date {
    return moment().toDate();
  }

  readonly paymentMinAmount$ = this.limitInfo$.pipe(
      map(([ debt, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
  );

  readonly paymentMaxAmount$ = this.limitInfo$.pipe(
      map(([ debt ]) => debt.debtAmount),
  );

  readonly paymentMinPercentage$ = this.limitInfo$.pipe(
      map(([ _, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent),
  );

  readonly isPaymentAmountDisabled$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => !outcome || outcome.paymentMode !== 3),
  );

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
