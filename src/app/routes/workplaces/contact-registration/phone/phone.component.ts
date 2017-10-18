import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.phone');

@Component({
  selector: 'app-contact-registration-phone',
  templateUrl: './phone.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent {
  controls = [
    { controlName: 'typeCode', type: 'selectwrapper', dictCode: 17 },
    { controlName: 'phoneNumber', type: 'text' },
    { controlName: 'stopAutoSms', type: 'checkbox' },
    { controlName: 'stopAutoInfo', type: 'checkbox' },
    { controlName: 'comment', type: 'textarea' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};
}
