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
              size: 50,
              children: [
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'contractTitlebar',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'GUARANTEE_ADD',
                  },
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
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'GUARANTEE_ADD',
                  },
                  form: 'contract',
                  label: 'Начало',
                  name: 'contractStartDate',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.DATE,
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'GUARANTEE_ADD',
                  },
                  form: 'contract',
                  label: 'Окончание',
                  name: 'contractEndDate',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'GUARANTEE_ADD',
                  },
                  form: 'contract',
                  dictCode: UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE,
                  label: 'Тип ответственности',
                  name: 'contractTypeCode',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXTAREA,
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'GUARANTEE_ADD',
                  },
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
              size: 50,
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
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ]
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ]
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ]
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ]
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ]
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ]
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        operator: ContextOperator.UI_STATE,
                        value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                      },
                      1,
                    ],
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
                        value: 363 + i - 1,
                      },
                      {
                        operator: ContextOperator.CONSTANT_CONTAINS,
                        value: [
                          {
                            operator: ContextOperator.PERSON_ATTRIBUTES,
                            value: {
                              operator: ContextOperator.UI_STATE,
                              value: 'workplaces/debtor-card/guarantee/card.default.value.typeCode',
                            }
                          },
                          363 + i - 1,
                        ],
                      },
                    ],
                  },
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
                  },
                  label: `Строковый атрибут ${i}`,
                  name: `stringValue${i}`,
                }) as IDynamicLayoutTextControl),
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXTAREA,
                  enabled: {
                    operator: ContextOperator.AND,
                    value: [
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'GUARANTEE_ADD',
                      },
                      {
                        operator: ContextOperator.PERMISSION_IS_TRUE,
                        value: 'PERSON_ADD',
                      },
                    ],
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
    },
  ],
};
