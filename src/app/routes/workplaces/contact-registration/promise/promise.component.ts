import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.promise');

@Component({
  selector: 'app-contact-registration-promise',
  templateUrl: './promise.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseComponent {
  private promiseMode = null;

  controls = [
    { controlName: 'date', type: 'datepicker', minDate: new Date() },
    { controlName: 'amount', type: 'number', disabled: this.promiseMode === 3 },
    { controlName: 'percentage', type: 'number', disabled: this.promiseMode === 3 },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};
}
