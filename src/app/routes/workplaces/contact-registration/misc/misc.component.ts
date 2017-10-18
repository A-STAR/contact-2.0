import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.misc');

@Component({
  selector: 'app-contact-registration-misc',
  templateUrl: './misc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiscComponent {
  controls = [
    { controlName: 'nextCallDateTime', type: 'datepicker', displayTime: true },
    { controlName: 'autoCommentId', type: 'select', options: [] },
    { controlName: 'autoComment', type: 'textarea', disabled: true },
    { controlName: 'callReasonCode', type: 'selectwrapper', dictCode: 49 },
    { controlName: 'debtReasonCode', type: 'selectwrapper', dictCode: 11 },
    { controlName: 'refusalReasonCode', type: 'selectwrapper', dictCode: 19 },
    { controlName: 'statusReasonCode', type: 'selectwrapper', dictCode: 19 },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};
}
