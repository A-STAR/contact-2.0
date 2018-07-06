import { ContextOperator } from '@app/core/context/context.interface';
import {
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
          label: 'routes.workplaces.shared.personSearch.filter.id',
          name: 'id',
        },
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.TEXT,
          label: 'routes.workplaces.shared.personSearch.filter.lastName',
          name: 'lastName',
        },
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.TEXT,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.UI_STATE,
                value: 'workplaces/debtor-card/contact-persons/card/filter.default.value.typeCode',
              },
              1,
            ]
          },
          enabled: {
            operator: ContextOperator.PERMISSION_IS_TRUE,
            value: 'PERSON_INFO_EDIT',
          },
          label: 'routes.workplaces.shared.personSearch.filter.firstName',
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
                value: 'workplaces/debtor-card/contact-persons/card/filter.default.value.typeCode',
              },
              1,
            ]
          },
          enabled: {
            operator: ContextOperator.PERMISSION_IS_TRUE,
            value: 'PERSON_INFO_EDIT',
          },
          label: 'routes.workplaces.shared.personSearch.filter.middleName',
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
          label: 'routes.workplaces.shared.personSearch.filter.typeCode',
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
                operator: ContextOperator.UI_STATE,
                value: 'workplaces/debtor-card/contact-persons/card/filter.default.value.typeCode',
              },
              1,
            ]
          },
          enabled: {
            operator: ContextOperator.PERMISSION_IS_TRUE,
            value: 'PERSON_INFO_EDIT',
          },
          label: 'routes.workplaces.shared.personSearch.filter.birthDate',
          name: 'birthDate',
        },
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.SELECT,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.UI_STATE,
                value: 'workplaces/debtor-card/contact-persons/card/filter.default.value.typeCode',
              },
              1,
            ]
          },
          enabled: {
            operator: ContextOperator.PERMISSION_IS_TRUE,
            value: 'PERSON_INFO_EDIT',
          },
          dictCode: UserDictionariesService.DICTIONARY_GENDER,
          label: 'routes.workplaces.shared.personSearch.filter.genderCode',
          name: 'genderCode',
        },
        {
          type: DynamicLayoutItemType.CONTROL,
          controlType: DynamicLayoutControlType.TEXT,
          display: {
            operator: ContextOperator.EQUALS,
            value: [
              {
                operator: ContextOperator.UI_STATE,
                value: 'workplaces/debtor-card/contact-persons/card/filter.default.value.typeCode',
              },
              1,
            ],
          },
          enabled: {
            operator: ContextOperator.PERMISSION_IS_TRUE,
            value: 'PERSON_INFO_EDIT',
          },
          label: 'routes.workplaces.shared.personSearch.filter.passportNumber',
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
                value: 363 + i - 1,
              },
              {
                operator: ContextOperator.CONSTANT_CONTAINS,
                value: [
                  {
                    operator: ContextOperator.PERSON_ATTRIBUTES,
                    value: {
                      operator: ContextOperator.UI_STATE,
                      value: 'workplaces/debtor-card/contact-persons/card/filter.default.value.typeCode',
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
          label: `routes.workplaces.shared.personSearch.filter.stringValue${i}`,
          name: `stringValue${i}`,
        }) as IDynamicLayoutTextControl),
      ],
    },
  ],
};
