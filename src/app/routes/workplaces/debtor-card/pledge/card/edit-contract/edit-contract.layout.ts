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

export const editContractLayout: IDynamicLayoutConfig = {
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
          size: 50,
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
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.contract.form.contractNumber',
                  name: 'contractNumber',
                  validators: {
                    required: true,
                  },
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.DATE,
                  form: 'contract',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.contract.form.contractStartDate',
                  name: 'contractStartDate',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.DATE,
                  form: 'contract',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.contract.form.contractEndDate',
                  name: 'contractEndDate',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXTAREA,
                  form: 'contract',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.contract.form.comment',
                  name: 'comment',
                },
                // {
                //   type: DynamicLayoutItemType.TEMPLATE,
                //   value: 'contractClearButton',
                // },
              ],
            },
            {
              type: DynamicLayoutItemType.GROUP,
              groupType: DynamicLayoutGroupType.VERTICAL,
              size: 33,
              children: [
                {
                  type: DynamicLayoutItemType.TEMPLATE,
                  value: 'pledgorTitlebar',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.typeCode',
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
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.lastName',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.firstName',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.middleName',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.birthDate',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.birthPlace',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  dictCode: UserDictionariesService.DICTIONARY_GENDER,
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.genderCode',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.familyStatusCode',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.educationCode',
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
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_INFO_EDIT',
                  },
                  label: `routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.stringValue${i}`,
                  name: `stringValue${i}`,
                }) as IDynamicLayoutTextControl),
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXTAREA,
                  enabled: {
                    operator: ContextOperator.PERMISSION_IS_TRUE,
                    value: 'PERSON_COMMENT_EDIT',
                  },
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.pledgor.form.comment',
                  name: 'comment',
                },
                // {
                //   type: DynamicLayoutItemType.TEMPLATE,
                //   value: 'pledgorClearButton',
                // },
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
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.propertyName',
                  name: 'propertyName',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'property',
                  dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE,
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.propertyType',
                  name: 'propertyType',
                  validators: {
                    required: true,
                  },
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'property',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.pledgeValue',
                  name: 'pledgeValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'property',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.marketValue',
                  name: 'marketValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'property',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.currencyId',
                  lookupKey: 'currencies',
                  name: 'currencyId',
                  validators: {
                    required: {
                      operator: ContextOperator.OR,
                      value: [
                        {
                          operator: ContextOperator.NOT_NULL,
                          value: {
                            operator: ContextOperator.UI_STATE,
                            value: 'workplaces/debtor-card/pledge/card.propertyValue.value.pledgeValue'
                          }
                        },
                        {
                          operator: ContextOperator.NOT_NULL,
                          value: {
                            operator: ContextOperator.UI_STATE,
                            value: 'workplaces/debtor-card/pledge/card.propertyValue.value.marketValue'
                          }
                        },
                      ],
                    },
                  },
                },
                // {
                //   type: DynamicLayoutItemType.TEMPLATE,
                //   value: 'propertyClearButton',
                // },
              ],
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
              display: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'PHONE_VIEW',
              },
              label: 'Телефоны',
              value: 'phones',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              display: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'ADDRESS_VIEW',
              },
              label: 'Адреса',
              value: 'addresses',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              display: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'EMAIL_VIEW',
              },
              label: 'Email-адреса',
              value: 'emails',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              display: {
                operator: ContextOperator.OR,
                value: [
                  {
                    operator: ContextOperator.PERMISSION_CONTAINS,
                    value: [ 'FILE_ATTACHMENT_VIEW_LIST', 18 ],
                  },
                  {
                    operator: ContextOperator.PERMISSION_CONTAINS,
                    value: [ 'FILE_ATTACHMENT_VIEW_LIST', 63 ],
                  },
                ],
              },
              label: 'Документы',
              value: 'documents',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              display: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'IDENTITY_DOCUMENT_VIEW',
              },
              label: 'Удостоверения личности',
              value: 'identification',
            },
            {
              type: DynamicLayoutItemType.TEMPLATE,
              display: {
                operator: ContextOperator.PERMISSION_IS_TRUE,
                value: 'EMPLOYMENT_VIEW',
              },
              label: 'История трудоустройства',
              value: 'employment',
            },
          ],
        },
      ],
    },
  ],
};
