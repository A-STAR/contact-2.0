import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as moment from 'moment';

import { IDebt } from '../../../../core/debt/debt.interface';
import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { AccordionService } from '../../../../shared/components/accordion/accordion.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { DebtService } from '../../../../core/debt/debt.service';
import { PaymentService } from './payment.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { isEmpty, makeKey } from '../../../../core/utils';

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
      this.contactRegistrationService.selectedNode$,
      this.debtService.fetch(null, this.debtId)
    )
    .subscribe(([ node, debt ]) => {
      if (node && isEmpty(node.children)) {
        const { paymentMode } = node.data;
        if (paymentMode === 3) {
          this.data = { ...this.data, amount: debt.debtAmount };
        }
        this.controls = this.buildControls(paymentMode, debt);
        this.cdRef.detectChanges();
      } else {
        this.controls = null;
      }
      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onNextClick(): void {
    const { guid } = this.contactRegistrationService;
    this.paymentService.create(this.debtId, guid, { amount: this.data.amount, ...this.form.serializedUpdates })
      .subscribe(() => {
        this.accordionService.next();
        this.cdRef.markForCheck();
      });
  }

  private buildControls(paymentMode: number, debt: IDebt): IDynamicFormControl[] {
    return [
      {
        controlName: 'date',
        type: 'datepicker',
        required: true,
        maxDate: moment().toDate(),
      },
      {
        total: debt.debtAmount,
        controlName: 'amount',
        type: 'debt-amount',
        required: true,
        disabled: paymentMode === 3,
      },
      {
        controlName: 'currencyId',
        type: 'selectwrapper',
        lookupKey: 'currencies',
        required: true
      },
    ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];
  }
}
