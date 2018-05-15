import {
  ContextOperator,
  DynamicLayoutControlType,
  DynamicLayoutGroupMode,
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutTextControl,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { range } from '@app/core/utils';

export const layout: IDynamicLayoutConfig = {
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
          size: 50,
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
              label: 'Тип',
              name: 'typeCode',
              validators: {
                required: true,
              },
            },
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              label: 'Фамилия/Название',
              name: 'lastName',
              validators: {
                required: true,
              },
            },
            {
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              label: 'Имя',
              name: 'firstName',
            },
            {
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              label: 'Отчество',
              name: 'middleName',
            },
            {
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.DATE,
              label: 'Дата рождения',
              name: 'birthDate',
            },
            {
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXT,
              label: 'Место рождения',
              name: 'birthPlace',
            },
            {
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              dictCode: UserDictionariesService.DICTIONARY_GENDER,
              label: 'Пол',
              name: 'genderCode',
            },
            {
              dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
              label: 'Семейное положение',
              name: 'familyStatusCode',
            },
            {
              dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
              // display: {
              //   type: IContextConfigItemType.STATE,
              //   method: IContextByStateMethod.EQUALS,
              //   key: 'contactPersonCardPersonForm.value.typeCode',
              //   value: 1,
              // },
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.SELECT,
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
                  // {
                  //   operator: ContextOperator.ATTRIBUTE_LIST,
                  //   value: key: 'contactPersonCardPersonForm.value.typeCode',
                  // },
                ]
              },
              label: `Строковый атрибут ${i}`,
              name: `stringValue${i}`,
            }) as IDynamicLayoutTextControl),
            {
              type: DynamicLayoutItemType.CONTROL,
              controlType: DynamicLayoutControlType.TEXTAREA,
              label: 'Комментарий',
              name: 'comment',
            },
          ],
        },
        {
          type: DynamicLayoutItemType.GROUP,
          groupType: DynamicLayoutGroupType.TABS,
          size: 50,
          children: [
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'identification',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'employment',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'addresses',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'phones',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              value: 'documents',
            },
          ],
        },
      ],
    },
  ],
};
