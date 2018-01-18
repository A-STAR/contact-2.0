import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as moment from 'moment';

import { IDebt } from '@app/core/debt/debt.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { AccordionService } from '@app/shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { DebtService } from '@app/core/debt/debt.service';
import { PaymentService } from './payment.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { minStrict, max } from '@app/core/validators';
import { isEmpty, makeKey, round } from '@app/core/utils';

const labelKey = makeKey('modules.contactRegistration.payment');

@Component({
  selector: 'app-contact-registration-payment',
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  @Input() debtId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];
  data: any = {};

  constructor(
    private accordionService: AccordionService,
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private debtService: DebtService,
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.contactRegistrationService.outcome$,
      this.debtService.fetch(null, this.debtId)
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

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    const { percentage, ...rest } = this.form.serializedUpdates;
    this.paymentService.create(this.debtId, guid, { amount: this.data.amount, ...rest })
      .subscribe(() => {
        this.accordionService.next();
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
