import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { isNumber } from 'util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-promise',
  templateUrl: 'promise.component.html'
})
export class ContactRegistrationPromiseComponent implements AfterViewInit, OnDestroy {
  @Input() formGroup: FormGroup;

  private limitInfo$ = combineLatest(
    this.contactRegistrationService.debt$.pipe(filter(Boolean)),
    this.contactRegistrationService.limit$.pipe(filter(Boolean)),
    this.contactRegistrationService.canSetInsufficientPromiseAmount$,
  );

  private isFullPromiseModeSub: Subscription;
  private amountControl: AbstractControl;
  private amountControlChangesSub: Subscription;
  private percentageControl: AbstractControl;
  private percentageControlChangesSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}


  ngAfterViewInit(): void {
    this.amountControl = this.formGroup.get('promise.amount');
    this.percentageControl = this.formGroup.get('promise.percentage');

    this.isFullPromiseModeSub = this.fullPromiseMode$
      .subscribe(_ => {
        this.amountControl.markAsDirty();
        this.percentageControl.markAsDirty();
      });

    this.amountControlChangesSub = this.amountControl
      .valueChanges
      .distinctUntilChanged()
      .pipe(filter(v => isNumber(v)))
      .subscribe(value => this.onPromiseAmountChange(value));

    this.percentageControlChangesSub = this.percentageControl
      .valueChanges
      .distinctUntilChanged()
      .pipe(filter(v => isNumber(v)))
      .subscribe(value => this.onPromisePercentageChange(value));
  }

  ngOnDestroy(): void {
    if (this.isFullPromiseModeSub) {
      this.isFullPromiseModeSub.unsubscribe();
    }
    if (this.amountControlChangesSub) {
      this.amountControlChangesSub.unsubscribe();
    }
    if (this.percentageControlChangesSub) {
      this.percentageControlChangesSub.unsubscribe();
    }
  }

  get today(): Date {
    return moment().toDate();
  }

  readonly fullPromiseMode$ = this.contactRegistrationService.outcome$.pipe(
    filter(outcome => outcome && outcome.paymentMode === 3),
    map(Boolean)
  );

  readonly promiseAmount$ = this.fullPromiseMode$.pipe(
    switchMap(_ => this.promiseMaxAmount$)
  );

  readonly promisePercentage$ = this.fullPromiseMode$.pipe(
    switchMap(_ => of(100))
  );

  readonly promiseMinAmount$ = this.limitInfo$.pipe(
    map(([ debt, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
  );

  readonly promiseMaxAmount$ = this.limitInfo$.pipe(
    map(([ debt ]) => debt.debtAmount),
  );

  readonly promiseMinPercentage$ = this.limitInfo$.pipe(
    map(([ _, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent),
  );

  readonly promiseMaxDate$ = this.contactRegistrationService.limit$.pipe(
    map(limit => {
      const maxDays = limit && limit.maxDays;
      return maxDays == null ? null : moment().add(maxDays, 'day').toDate();
    }),
  );

  readonly isPromiseAmountDisabled$ = this.contactRegistrationService.outcome$.pipe(
    map(outcome => !outcome || outcome.promiseMode !== 3),
  );

  onPromiseAmountChange(amount: number): void {
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPromiseAmount(null, (100.0 * amount / debt.debtAmount)));
  }

  onPromisePercentageChange(percentage: number): void {
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPromiseAmount(debt.debtAmount * percentage / 100.0, null));
  }

  private setPromiseAmount(amount?: number, percentage?: number): void {
    const data = { promise: { } as any };
    if (isNumber(amount)) {
      data.promise.amount = amount;
      if (this.amountControl.pristine) {
        this.amountControl.markAsDirty();
      }
    } else if (isNumber(percentage)) {
      data.promise.percentage = percentage;
      if (this.percentageControl.pristine) {
        this.percentageControl.markAsDirty();
      }
    }
    this.formGroup.patchValue(data, { emitEvent: false });
    this.cdRef.markForCheck();
  }
}
