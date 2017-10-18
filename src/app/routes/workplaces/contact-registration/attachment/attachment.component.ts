import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.attachment');

@Component({
  selector: 'app-contact-registration-attachment',
  templateUrl: './attachment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentComponent {
  controls = [
    { controlName: 'docTypeCode', type: 'selectwrapper', dictCode: 33 },
    { controlName: 'docName', type: 'text' },
    { controlName: 'docNumber', type: 'text' },
    { controlName: 'comment', type: 'textarea' },
    { controlName: 'file', type: 'file' },
  ].map(item => ({ ...item, label: labelKey(item.controlName) })) as IDynamicFormControl[];

  data = {};
}
