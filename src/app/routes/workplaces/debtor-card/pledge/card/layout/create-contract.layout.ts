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

export const createContractLayout: IDynamicLayoutConfig = {
  key: 'workplaces/debtor-card/guarantee/card',
  items: [
    {
      type: DynamicLayoutItemType.GROUP,
      groupType: DynamicLayoutGroupType.VERTICAL,
      mode: DynamicLayoutGroupMode.SPLITTERS,
      size: 100,
      children: [
        {
          type: DynamicLayoutItemType.GROUP,
          groupType: DynamicLayoutGroupType.HORIZONTAL,
          mode: DynamicLayoutGroupMode.SPLITTERS,
          size: 100,
          children: [
            {
              type: DynamicLayoutItemType.GROUP,
              groupType: DynamicLayoutGroupType.VERTICAL,
              size: 33,
              children: [
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'contractTitlebar',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'contract',
                  label: 'Номер договора',
                  name: 'contractNumber',
                  validators: {
                    required: true,
                  },
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.DATE,
                  form: 'contract',
                  label: 'Начало',
                  name: 'contractStartDate',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.DATE,
                  form: 'contract',
                  label: 'Окончание',
                  name: 'contractEndDate',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXTAREA,
                  form: 'contract',
                  label: 'Комментарий',
                  name: 'comment',
                },
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'contractClearButton',
                },
              ],
            },
            {
              type: DynamicLayoutItemType.GROUP,
              groupType: DynamicLayoutGroupType.VERTICAL,
              size: 33,
              children: [
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'personTitlebar',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                        value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
                              value: 'layout.workplaces/debtor-card/guarantee/card.forms.default.value.typeCode',
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
            {
              type: DynamicLayoutItemType.GROUP,
              groupType: DynamicLayoutGroupType.VERTICAL,
              size: 33,
              children: [
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'propertyTitlebar',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'property',
                  label: 'Название',
                  name: 'propertyName',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'property',
                  dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE,
                  label: 'Тип имущества',
                  name: 'propertyType',
                  validators: {
                    required: true,
                  },
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'propertyValue',
                  label: 'Залоговая стоимость',
                  name: 'pledgeValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'propertyValue',
                  label: 'Рыночная стоимость',
                  name: 'marketValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'propertyValue',
                  label: 'Валюта',
                  lookupKey: 'currencies',
                  name: 'currencyId',
                  validators: {
                    required: {
                      operator: ContextOperator.OR,
                      value: [
                        {
                          operator: ContextOperator.NOT_NULL,
                          value: 'layout.workplaces/debtor-card/pledge/card.forms.propertyValue.value.pledgeValue',
                        },
                        {
                          operator: ContextOperator.NOT_NULL,
                          value: 'layout.workplaces/debtor-card/pledge/card.forms.propertyValue.value.marketValue',
                        },
                      ],
                    },
                  },
                },
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'propertyClearButton',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
