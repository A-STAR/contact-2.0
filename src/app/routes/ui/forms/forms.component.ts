import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';
import { IContextConfigItemType, IContextByValueBagMethod } from '@app/core/context/context.interface';

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
          minLength: {
            type: IContextConfigItemType.CONSTANT,
            method: IContextByValueBagMethod.VALUE,
            value: 'UserPassword.MinLength',
          },
          required: true,
        },
      },
      {
        children: [
          {
            display: true,
            label: 'Nested Text Input',
            name: 'nestedText',
            type: IMetadataFormControlType.TEXT,
            validators: {
              maxLength: 10,
            },
          },
          {
            children: [
              {
                disabled: true,
                display: true,
                label: 'Deeply Nested Text Input',
                name: 'deeplyNestedText',
                type: IMetadataFormControlType.TEXT,
                validators: {},
              },
            ],
            type: IMetadataFormControlType.GROUP,
          },
        ],
        type: IMetadataFormControlType.GROUP,
      },
    ],
  };

  readonly data = {
    text: 'Text',
    nestedText: 'Nested Text',
    deeplyNestedText: 'Deeply Nested Text',
  };
}
