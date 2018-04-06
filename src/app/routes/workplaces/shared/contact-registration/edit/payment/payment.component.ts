import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map, switchMap, } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-payment',
  templateUrl: 'payment.component.html'
})
export class ContactRegistrationPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() formGroup: FormGroup;

  private limitInfo$ = combineLatest(
    this.contactRegistrationService.debt$.pipe(filter(Boolean)),
    this.contactRegistrationService.limit$.pipe(filter(Boolean)),
    this.contactRegistrationService.canSetInsufficientPromiseAmount$,
  );
  private isFullPaymentModeSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngAfterViewInit(): void {
    this.isFullPaymentModeSub = this.fullPaymentMode$
      .subscribe(_ => {
        this.formGroup.get('payment.amount').markAsDirty();
        this.formGroup.get('payment.percentage').markAsDirty();
      });
  }

  ngOnDestroy(): void {
    if (this.isFullPaymentModeSub) {
      this.isFullPaymentModeSub.unsubscribe();
    }
  }

  readonly canDisplayForm$ = this.contactRegistrationService.outcome$.pipe(
      map(outcome => outcome && [2, 3].includes(outcome.paymentMode)),
  );

  get today(): Date {
    return moment().toDate();
  }

  readonly fullPaymentMode$ = this.contactRegistrationService.outcome$.pipe(
    filter(outcome => outcome && outcome.paymentMode === 3),
    map(Boolean)
  );

  readonly paymentAmount$ = this.fullPaymentMode$.pipe(
    switchMap(_ => this.paymentMaxAmount$)
  );

  readonly paymentPercentage$ = this.fullPaymentMode$.pipe(
    switchMap(_ => of(100))
  );

  readonly paymentMinAmount$ = this.limitInfo$.pipe(
      map(([ debt, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
  );

  readonly paymentMaxAmount$ = this.limitInfo$.pipe(
      map(([ debt ]) => debt.debtAmount),
  );

  readonly paymentMinPercentage$ = this.limitInfo$.pipe(
      map(([ _, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent),
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
