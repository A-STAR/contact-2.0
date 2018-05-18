import {
  ContextOperator,
  DynamicLayoutControlType,
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
  IDynamicLayoutTextControl,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { range } from '@app/core/utils';

export const layout: IDynamicLayoutConfig = {
  key: 'workplaces/debtor-card/contact-persons/card/filter',
  items: [
    {
      type: DynamicLayoutItemType.GROUP,
      groupType: DynamicLayoutGroupType.VERTICAL,
      size: 50,
      children: [
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.TEXT,
          label: 'ID',
          name: 'id',
        },
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.TEXT,
          label: 'Фамилия/Название',
          name: 'lastName',
        },
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.TEXT,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.EVAL,
                value: 'layout.workplaces/debtor-card/contact-persons/card/filter.forms.default.value.typeCode',
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
                value: 'layout.workplaces/debtor-card/contact-persons/card/filter.forms.default.value.typeCode',
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
          controlType: DynamicLayoutControlType.DATE,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.EVAL,
                value: 'layout.workplaces/debtor-card/contact-persons/card/filter.forms.default.value.typeCode',
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
          controlType: DynamicLayoutControlType.SELECT,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.EVAL,
                value: 'layout.workplaces/debtor-card/contact-persons/card/filter.forms.default.value.typeCode',
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
          controlType: DynamicLayoutControlType.TEXT,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.EVAL,
                value: 'layout.workplaces/debtor-card/contact-persons/card/filter.forms.default.value.typeCode',
              },
              1,
            ],
          },
          enabled: {
            operator: ContextOperator.PERMISSION_IS_TRUE,
            value: 'PERSON_INFO_EDIT',
          },
          label: 'Серия и номер паспорта',
          name: 'passportNumber',
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
                      value: 'layout.workplaces/debtor-card/contact-persons/card/filter.forms.default.value.typeCode',
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
      ],
    },
  ],
};
