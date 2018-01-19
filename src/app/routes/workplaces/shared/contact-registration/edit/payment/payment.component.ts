import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter, map, mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

import { IDebt } from '@app/core/debt/debt.interface';
import {
  IDynamicFormControl,
  IDynamicFormDebtAmountControl,
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactRegistrationService } from '../../contact-registration.service';
import { PaymentService } from './payment.service';
import { WorkplacesService } from '@app/routes/workplaces/workplaces.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('modules.contactRegistration.payment');

@Component({
  selector: 'app-contact-registration-payment',
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { controlName: 'date', type: 'datepicker', required: true, maxDate: moment().toDate() },
    { controlName: 'amount', type: 'debt-amount', required: true, disabled: false, total: 0 },
    { controlName: 'currencyId', type: 'selectwrapper', lookupKey: 'currencies', required: true },
  ]
  .map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private paymentService: PaymentService,
    private workplacesService: WorkplacesService,
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.contactRegistrationService.debtId$.pipe(mergeMap(debtId => this.workplacesService.fetchDebt(debtId))),
      this.contactRegistrationService.outcome$.pipe(filter(Boolean), map(outcome => outcome.paymentMode)),
    )
    .subscribe(([ debt, paymentMode ]) => {
      const amountControl = this.form.getControlDef('amount') as IDynamicFormDebtAmountControl;
      amountControl.total = debt.debtAmount;
      amountControl.disabled = paymentMode === 3;
      amountControl.required = paymentMode !== 3;
      if (paymentMode === 3) {
        this.data = { ...this.data, amount: debt.debtAmount };
      }
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  submit$(): Observable<void> {
    const { guid } = this.contactRegistrationService;
    return this.contactRegistrationService.debtId$
      .pipe(
        mergeMap(debtId => this.paymentService.create(debtId, guid, { ...this.form.serializedUpdates })),
      );
  }
}
