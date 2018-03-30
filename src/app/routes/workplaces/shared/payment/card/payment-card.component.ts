import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IPayment } from '../payment.interface';

import { PaymentService } from '../payment.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { addFormLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html'
})
export class PaymentCardComponent implements OnInit {
  @Input() callCenter = false;
  @Input() readOnly = false;
  @Input() debtId: number;
  @Input() paymentId: number;

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = null;
  dialog: string;
  payment: IPayment;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    combineLatest(
      this.userPermissionsService.bag(),
      this.paymentId
        ? this.paymentService.fetch(this.debtId, this.paymentId, this.callCenter)
        : of(null),
    )
    .pipe(first())
    .subscribe(([ bag, payment ]) => {
      const canAdd = bag.has('PAYMENT_ADD');
      const canEdit = bag.has('PAYMENT_EDIT');
      const canEditUser = bag.has('PAYMENT_USER_EDIT');
      const canConfirm = bag.has('PAYMENT_CONFIRM');
      this.payment = payment
        ? payment
        : {
            receiveDateTime: new Date(),
            paymentDateTime: new Date(),
          };

      // TODO: fix displaying of selected payment
      this.controls = [
        { controlName: 'amount', disabled: !canEdit, type: 'number', positive: true, width: 6, required: true },
        { controlName: 'currencyId', disabled: !canEdit, type: 'select', required: true, lookupKey: 'currencies', width: 6 },
        {
          controlName: 'paymentDateTime',
          disabled: !canEdit,
          markAsDirty: !payment,
          required: true,
          type: 'datepicker',
          width: 6,
        },
        { controlName: 'receiveDateTime', disabled: !canEdit, type: 'datepicker', markAsDirty: !payment, width: 6 },
        { controlName: 'payerName', type: 'text', disabled: !canEdit, width: 6 },
        { controlName: 'reqUserId', disabled: !canEditUser, type: 'select', lookupKey: 'users', width: 6 },
        { controlName: 'receiptNumber', type: 'text', disabled: !canEdit, width: 6 },
        {
          controlName: 'purposeCode',
          dictCode: UserDictionariesService.DICTIONARY_PAYMENT_PURPOSE,
          disabled: !canEdit,
          type: 'select',
          width: 6,
        },
        { controlName: 'comment', type: 'textarea', disabled: !canEdit, width: 12 },
        { controlName: 'isConfirmed', disabled: !canConfirm, type: 'checkbox', width: 12 },
      ]
      .filter(control => {
        const shouldFilter = !canConfirm && !this.paymentId;
        return control.controlName !== 'isConfirmed' || !shouldFilter;
      })
      .map(addFormLabel('widgets.payment.grid'))
      .map(item => ({
        ...item,
        disabled: this.readOnly || this.payment.isCanceled || !canAdd
      }));

      this.cdRef.markForCheck();
    });
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onBack(): void {
    const { paramMap } = this.route.snapshot;
    const url = this.callCenter
      ? [ `/workplaces/call-center/${paramMap.get('campaignId')}` ]
      : [ `/workplaces/debtor-card/${paramMap.get('debtId')}` ];

    this.routingService.navigate(url);
  }

  onSubmit(): void {
    const data: IPayment = this.form.serializedUpdates;
    const { isConfirmed } = this.form.serializedValue;
    const action = this.paymentId
      ? this.paymentService.update(this.debtId, this.paymentId, data, this.callCenter)
      : this.paymentService.create(this.debtId, {...data, isConfirmed }, this.callCenter);

    action.subscribe(() => {
      this.paymentService.dispatchAction(PaymentService.MESSAGE_PAYMENT_SAVED);
      this.onBack();
    });
  }
}
