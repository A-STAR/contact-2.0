import {
  IContextByStateMethod,
  IContextConfigItemType,
  IContextConfigOperator,
} from '@app/core/context/context.interface';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

export const propertyFormConfig: IMetadataFormConfig = {
  id: 'pledgeCardPropertyForm',
  editable: true,
  items: [
    {
      disabled: false,
      display: true,
      label: 'Название',
      name: 'name',
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    },
    {
      dictCode: UserDictionariesService.DICTIONARY_PROPERTY_TYPE,
      disabled: false,
      display: true,
      label: 'Тип имущества',
      name: 'typeCode',
      type: IMetadataFormControlType.SELECT,
      validators: {
        required: true,
      },
      width: 0,
    },
    {
      disabled: false,
      display: true,
      label: 'Залоговая стоимость',
      name: 'pledgeValue',
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    },
    {
      disabled: false,
      display: true,
      label: 'Рыночная стоимость',
      name: 'marketValue',
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    },
    {
      disabled: false,
      display: true,
      label: 'Валюта',
      lookupKey: 'currencies',
      name: 'currencyId',
      type: IMetadataFormControlType.SELECT,
      validators: {
        required: {
          type: IContextConfigItemType.GROUP,
          operator: IContextConfigOperator.OR,
          children: [
            {
              type: IContextConfigItemType.STATE,
              method: IContextByStateMethod.NOT_EMPTY,
              key: 'pledgeCardPropertyForm.value.pledgeValue',
            },
            {
              type: IContextConfigItemType.STATE,
              method: IContextByStateMethod.NOT_EMPTY,
              key: 'pledgeCardPropertyForm.value.marketValue',
            },
          ],
        },
      },
      width: 0,
    },
  ],
  plugins: [],
};
