import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map, switchMap, } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { isNumber } from 'util';

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
  private amountControl: AbstractControl;
  private amountControlChangesSub: Subscription;
  private percentageControl: AbstractControl;
  private percentageControlChangesSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngAfterViewInit(): void {
    this.amountControl = this.formGroup.get('payment.amount');
    this.percentageControl = this.formGroup.get('payment.percentage');

    this.isFullPaymentModeSub = this.fullPaymentMode$
      .subscribe(_ => {
        this.amountControl.markAsDirty();
        this.percentageControl.markAsDirty();
      });

      this.amountControlChangesSub = this.amountControl
        .valueChanges
        .distinctUntilChanged()
        .pipe(filter(v => isNumber(v)))
        .subscribe(value => this.onPaymentAmountChange(value));

    this.percentageControlChangesSub = this.percentageControl
        .valueChanges
        .distinctUntilChanged()
        .pipe(filter(v => isNumber(v)))
        .subscribe(value => this.onPaymentPercentageChange(value));
  }

  ngOnDestroy(): void {
    if (this.isFullPaymentModeSub) {
      this.isFullPaymentModeSub.unsubscribe();
    }
    if (this.amountControlChangesSub) {
      this.amountControlChangesSub.unsubscribe();
    }
    if (this.percentageControlChangesSub) {
      this.percentageControlChangesSub.unsubscribe();
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

  onPaymentAmountChange(amount: number): void {
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPaymentAmount(null, 100.0 * amount / debt.debtAmount));
  }

  onPaymentPercentageChange(percentage: number): void {
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPaymentAmount(debt.debtAmount * percentage / 100.0, null));
  }

  private setPaymentAmount(amount: number, percentage: number): void {
    const data = { promise: { } as any };
    if (isNumber(amount)) {
      data.promise.amount = amount;
    } else if (isNumber(percentage)) {
      data.promise.percentage = percentage;
    }
    this.formGroup.patchValue(data, { emitEvent: false });
    this.cdRef.markForCheck();
  }
}
