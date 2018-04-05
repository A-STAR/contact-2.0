import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';
import { IContextConfigItemType, IContextByValueBagMethod } from '@app/core/context/context.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-forms',
  templateUrl: './forms.component.html'
})
export class FormsComponent {
  readonly config: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'Text Input',
        name: 'text',
        type: IMetadataFormControlType.TEXT,
        validators: {
          required: true,
        },
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Password Input',
        name: 'password',
        type: IMetadataFormControlType.PASSWORD,
        validators: {
          complexity: {
            type: IContextConfigItemType.CONSTANT,
            method: IContextByValueBagMethod.HAS,
            value: 'UserPassword.Complexity.Use',
          },
          minLength: {
            type: IContextConfigItemType.CONSTANT,
            method: IContextByValueBagMethod.VALUE,
            value: 'UserPassword.MinLength',
          },
          required: true,
        },
        width: 0,
      },
      {
        children: [
          {
            disabled: false,
            display: true,
            label: 'Nested Text Input',
            name: 'nestedText',
            type: IMetadataFormControlType.TEXT,
            validators: {
              maxLength: 10,
            },
            width: 0,
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
                width: 0,
              },
            ],
            display: true,
            type: IMetadataFormControlType.GROUP,
            width: 0,
          },
        ],
        display: true,
        type: IMetadataFormControlType.GROUP,
        width: 0,
      },
    ],
    plugins: [],
  };

  readonly data = {
    text: 'Text',
    nestedText: 'Nested Text',
    deeplyNestedText: 'Deeply Nested Text',
  };
}
