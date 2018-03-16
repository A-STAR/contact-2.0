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
    items: [
      {
        display: true,
        label: 'Text Input',
        max: 20,
        min: 'userConstants/constants/UserPassword.MinLength/valueN',
        name: 'text',
        required: false,
        type: IMetadataFormControlType.TEXT,
      },
    ],
  };
}
