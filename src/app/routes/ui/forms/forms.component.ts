import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-route-ui-forms',
  templateUrl: './forms.component.html'
})
export class FormsComponent {
  readonly config: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        display: true,
        label: 'Text Input',
        name: 'text',
        type: IMetadataFormControlType.TEXT,
        validators: {
          maxLength: 20,
          minLength: 'userConstants/constants/UserPassword.MinLength/valueN',
          required: true,
        }
      },
    ],
  };
}
