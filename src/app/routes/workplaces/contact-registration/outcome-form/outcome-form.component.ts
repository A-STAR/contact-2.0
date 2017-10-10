import { Component, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.outcomeForm')

@Component({
  selector: 'app-outcome-form',
  templateUrl: './outcome-form.component.html',
})
export class OutcomeFormComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { label: labelKey('template'), controlName: 'template', type: 'textarea', disabled: true },
    { label: labelKey('autoCommentId'), controlName: 'autoCommentId', type: 'selectwrapper', lookupKey: 'currencies' },
    { label: labelKey('autoComment'), controlName: 'autoComment', type: 'textarea', disabled: true },
    { label: labelKey('comment'), controlName: 'comment', type: 'textarea' },
  ];
  data = {};
}
