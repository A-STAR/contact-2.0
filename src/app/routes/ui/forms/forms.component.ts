import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IMetadataFormGroupType,
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
        width: 1,
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
        width: 1,
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
                label: 'Deeply Nested Text Input 1',
                name: 'deeplyNestedText1',
                type: IMetadataFormControlType.TEXT,
                validators: {},
                width: 1,
              },
              {
                disabled: true,
                display: true,
                label: 'Deeply Nested Text Input 2',
                name: 'deeplyNestedText2',
                type: IMetadataFormControlType.TEXT,
                validators: {},
                width: 1,
              },
            ],
            border: false,
            display: true,
            groupType: IMetadataFormGroupType.TABS,
            label: 'Group 2',
            type: IMetadataFormControlType.GROUP,
            width: 0,
          },
        ],
        border: true,
        display: true,
        type: IMetadataFormControlType.GROUP,
        label: 'Group 1',
        groupType: IMetadataFormGroupType.PLAIN,
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
