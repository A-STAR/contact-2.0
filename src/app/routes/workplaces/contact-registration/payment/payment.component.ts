import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.payment');

@Component({
  selector: 'app-contact-registration-payment',
  templateUrl: './payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  controls = [
    { controlName: 'date', type: 'datepicker' },
    { controlName: 'amount', type: 'number' },
    { controlName: 'percentage', type: 'number' },
    { controlName: 'currencyId', type: 'selectwrapper', lookupKey: 'currencies' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};
}
