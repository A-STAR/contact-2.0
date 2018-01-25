import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';
import * as moment from 'moment';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

import { invert } from '@app/core/utils';
import { minStrict, max } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-payment',
  templateUrl: 'payment.component.html'
})
export class ContactRegistrationPaymentComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;

  private formSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    // TODO(d.maltsev): check out async validators?
    this.formSub = combineLatest(
      this.contactRegistrationService.debt$.pipe(filter(Boolean)),
      this.contactRegistrationService.limit$.pipe(filter(Boolean)),
    )
    .subscribe(([ debt, limit ]) => {
      this.formGroup.get('payment.amount').setValidators([
        minStrict(0),
        max(debt.debtAmount),
      ]);
      this.formGroup.get('payment.percentage').setValidators([
        minStrict(0),
        max(100),
      ]);
    });
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPayment$;
  }

  get today(): Date {
    return moment().toDate();
  }

  get isPaymentAmountDisabled$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPaymentAmount$.pipe(map(invert));
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
