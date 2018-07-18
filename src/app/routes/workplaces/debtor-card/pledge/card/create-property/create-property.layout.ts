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
                  controlType: DynamicLayoutControlType.NUMBER,
                  form: 'propertyValue',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.pledgeValue',
                  name: 'pledgeValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.NUMBER,
                  form: 'propertyValue',
                  label: 'routes.workplaces.debtorCard.pledge.card.forms.property.form.marketValue',
                  name: 'marketValue',
                },
                {
                  type: DynamicLayoutItemType.CONTROL,
                  controlType: DynamicLayoutControlType.SELECT,
                  form: 'propertyValue',
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
