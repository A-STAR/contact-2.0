import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { mergeMap } from 'rxjs/operators/mergeMap';
import * as moment from 'moment';

import { IDebt } from '@app/core/debt/debt.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactRegistrationService } from '../../contact-registration.service';
import { PaymentService } from './payment.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { minStrict, max } from '@app/core/validators';
import { makeKey, round } from '@app/core/utils';

const labelKey = makeKey('modules.contactRegistration.payment');

@Component({
  selector: 'app-contact-registration-payment',
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  data: any = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private paymentService: PaymentService,
    private workplacesService: WorkplacesService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.contactRegistrationService.outcome$,
      this.contactRegistrationService.debtId$.pipe(
        mergeMap(debtId => this.workplacesService.fetchDebt(debtId)),
      ),
    )
    .subscribe(([ outcome, debt ]) => {
      const { paymentMode } = outcome;
      if (paymentMode === 3) {
        this.data = { ...this.data, amount: debt.debtAmount, percentage: 100 };
      }
      this.controls = this.buildControls(paymentMode, debt);
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  submit(): void {
    const { guid } = this.contactRegistrationService;
    const { percentage, ...rest } = this.form.serializedUpdates;
    this.contactRegistrationService.debtId$
      .pipe(
        mergeMap(debtId => this.paymentService.create(debtId, guid, { amount: this.data.amount, ...rest })),
      )
      .subscribe(() => {
        //
        this.cdRef.markForCheck();
      });
  }

  private buildControls(paymentMode: number, debt: IDebt): IDynamicFormControl[] {
    const maxDate = moment().toDate();
    const { debtAmount } = debt;
    return [
      {
        controlName: 'date',
        type: 'datepicker',
        required: true,
        maxDate
      },
      {
        controlName: 'amount',
        type: 'number',
        required: true,
        disabled: paymentMode === 3,
        validators: [ minStrict(0), max(debtAmount) ],
        onChange: event => this.onAmountChange(event, debtAmount)
      },
      {
        controlName: 'percentage',
        type: 'number',
        disabled: paymentMode === 3,
        validators: [ minStrict(0), max(100) ],
        onChange: event => this.onPercentageChange(event, debtAmount)
      },
      {
        controlName: 'currencyId',
        type: 'selectwrapper',
        lookupKey: 'currencies',
        required: true
      },
    ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];
  }

  private onAmountChange(event: Event, total: number): void {
    const { value } = event.target as HTMLInputElement;
    const amount = Number(value);
    this.setAmount(amount, 100.0 * amount / total);
  }

  private onPercentageChange(event: Event, total: number): void {
    const { value } = event.target as HTMLInputElement;
    const percentage = Number(value);
    this.setAmount(total * percentage / 100.0, percentage);
  }

  private setAmount(amount: number, percentage: number): void {
    this.data = { ...this.data, amount: round(amount, 2) || null, percentage: round(percentage, 2) || null };
    this.cdRef.markForCheck();
  }
}
