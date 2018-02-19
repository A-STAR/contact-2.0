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
  selector: 'app-contact-registration-promise',
  templateUrl: 'promise.component.html'
})
export class ContactRegistrationPromiseComponent {
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
    return this.contactRegistrationService.canSetPromise$;
  }

  get today(): Date {
    return moment().toDate();
  }

  get promiseMinAmount$(): Observable<number> {
    return this.limitInfo$.pipe(
      map(([ debt, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent * debt.debtAmount / 100),
    );
  }

  get promiseMaxAmount$(): Observable<number> {
    return this.limitInfo$.pipe(
      map(([ debt ]) => debt.debtAmount),
    );
  }

  get promiseMinPercentage$(): Observable<number> {
    return this.limitInfo$.pipe(
      map(([ _, limit, canSet ]) => canSet ? 0 : limit.minAmountPercent),
    );
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
    return this.contactRegistrationService.outcome$.pipe(
      map(outcome => !outcome || outcome.promiseMode !== 3),
    );
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
