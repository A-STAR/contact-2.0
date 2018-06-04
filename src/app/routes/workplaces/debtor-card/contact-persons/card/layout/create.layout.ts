import { ContextOperator } from '@app/core/context/context.interface';
import {
  DynamicLayoutControlType,
  DynamicLayoutGroupMode,
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutTextControl,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { range } from '@app/core/utils';

export const createContactPersonLayout: IDynamicLayoutConfig = {
  key: 'workplaces/debtor-card/contact-persons/card',
  items: [
    {
      type: DynamicLayoutItemType.GROUP,
      groupType: DynamicLayoutGroupType.VERTICAL,
      mode: DynamicLayoutGroupMode.SPLITTERS,
      size: 100,
      children: [
        {
          type: DynamicLayoutItemType.GROUP,
          groupType: DynamicLayoutGroupType.VERTICAL,
          size: 100,
          children: [
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'personTitlebar',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE,
              form: 'link',
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'CONTACT_PERSON_EDIT',
              },
              label: 'Тип связи',
              name: 'linkTypeCode',
              validators: {
                required: true,
              },
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Тип',
              name: 'typeCode',
              validators: {
                required: true,
              },
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Фамилия/Название',
              name: 'lastName',
              validators: {
                required: true,
              },
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ]
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Имя',
              name: 'firstName',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ]
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Отчество',
              name: 'middleName',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.DATE,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ]
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Дата рождения',
              name: 'birthDate',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ]
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Место рождения',
              name: 'birthPlace',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ]
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              dictCode: UserDictionariesService.DICTIONARY_GENDER,
              label: 'Пол',
              name: 'genderCode',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ]
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Семейное положение',
              name: 'familyStatusCode',
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
              display: {
                operator: ContextOperator.EQUALS,
                value: [
                  {
                    operator: ContextOperator.EVAL,
                    value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                  },
                  1,
                ],
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: 'Образование',
              name: 'educationCode',
            },
            ...range(1, 10).map(i => ({
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              display: {
                operator: ContextOperator.AND,
                value: [
                  {
                    operator: ContextOperator.ENTITY_IS_USED,
                    value: 363 + i,
                  },
                  {
                    operator: ContextOperator.CONSTANT_CONTAINS,
                    value: [
                      {
                        operator: ContextOperator.PERSON_ATTRIBUTES,
                        value: {
                          operator: ContextOperator.EVAL,
                          value: 'layout.workplaces/debtor-card/contact-persons/card.forms.default.value.typeCode',
                        }
                      },
                      363 + i,
                    ],
                  },
                ],
              },
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_INFO_EDIT',
              },
              label: `Строковый атрибут ${i}`,
              name: `stringValue${i}`,
            }) as IDynamicLayoutTextControl),
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXTAREA,
              enabled: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PERSON_COMMENT_EDIT',
              },
              label: 'Комментарий',
              name: 'comment',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'personClearButton',
            },
          ],
        },
      ],
    },
  ],
};
