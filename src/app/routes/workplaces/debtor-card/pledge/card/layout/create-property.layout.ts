import { ContextOperator } from '@app/core/context/context.interface';
import {
  DynamicLayoutControlType,
  DynamicLayoutGroupMode,
  DynamicLayoutGroupType,
  DynamicLayoutItemType,
  IDynamicLayoutConfig,
} from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

export const createPropertyLayout: IDynamicLayoutConfig = {
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
              size: 100,
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
                  name: 'name',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'property',
                  dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE,
                  label: 'Тип имущества',
                  name: 'typeCode',
                  validators: {
                    required: true,
                  },
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'property',
                  label: 'Залоговая стоимость',
                  name: 'pledgeValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.TEXT,
                  form: 'property',
                  label: 'Рыночная стоимость',
                  name: 'marketValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'property',
                  label: 'Валюта',
                  lookupKey: 'currencies',
                  name: 'currencyId',
                  validators: {
                    required: {
                      operator: ContextOperator.OR,
                      value: [
                        {
                          operator: ContextOperator.NOT_NULL,
                          value: 'layout.workplaces/debtor-card/pledge/card.forms.property.value.pledgeValue',
                        },
                        {
                          operator: ContextOperator.NOT_NULL,
                          value: 'layout.workplaces/debtor-card/pledge/card.forms.property.value.marketValue',
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
