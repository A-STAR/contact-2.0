import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.comment');

@Component({
  selector: 'app-contact-registration-comment',
  templateUrl: './comment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  controls: IDynamicFormControl[] = [
    { label: labelKey('comment'), controlName: 'comment', type: 'textarea' },
  ];

  data = {};
}
