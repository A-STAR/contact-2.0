import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, first, map } from 'rxjs/operators';
import * as moment from 'moment';

import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';

import { isEmpty, invert } from '@app/core/utils';
import { minStrict, max } from '@app/core/validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-promise',
  templateUrl: 'promise.component.html'
})
export class ContactRegistrationPromiseComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;

  private formSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
  ) {}

  ngOnInit(): void {
    // TODO(d.maltsev): check out async validators?
    this.formSub = combineLatest(
      this.contactRegistrationService.canSetInsufficientPromiseAmount$,
      this.contactRegistrationService.debt$.pipe(filter(Boolean)),
      this.contactRegistrationService.limit$.pipe(filter(Boolean)),
    )
    .subscribe(([ canSet, debt, limit ]) => {
      this.formGroup.get('promise.amount').setValidators([
        minStrict(canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
        max(debt.debtAmount),
      ]);
      this.formGroup.get('promise.percentage').setValidators([
        minStrict(canSet ? 0 : limit.minAmountPercent),
        max(100),
      ]);
    });
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  get canDisplayForm$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPromise$;
  }

  get today(): Date {
    return moment().toDate();
  }

  get promiseMaxDate$(): Observable<Date> {
    return this.contactRegistrationService.limit$.pipe(
      map(limit => {
        const maxDays = limit && limit.maxDays;
        return maxDays == null ? null : moment().add(maxDays, 'day').toDate();
      }),
    );
  }

  get isPromiseAmountDisabled$(): Observable<boolean> {
    return this.contactRegistrationService.canSetPromiseAmount$.pipe(map(invert));
  }

  onPromiseAmountInput(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const amount = Number(value);
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPromiseAmount(amount, 100.0 * amount / debt.debtAmount));
  }

  onPromisePercentageInput(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    const percentage = Number(value);
    this.contactRegistrationService.debt$
      .pipe(first())
      .subscribe(debt => debt && this.setPromiseAmount(debt.debtAmount * percentage / 100.0, percentage));
  }

  private setPromiseAmount(amount: number, percentage: number): void {
    this.formGroup.patchValue({ promise: { amount, percentage } });
    this.cdRef.markForCheck();
  }
}
