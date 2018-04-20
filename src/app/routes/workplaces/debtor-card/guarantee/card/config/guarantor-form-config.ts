import {
  IContextConfigItemType,
  IContextByStateMethod,
  IContextConfigOperator,
  IContextByEntityMethod,
  IContextByValueBagMethod,
  IContextByExpressionMethod,
} from '@app/core/context/context.interface';
import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IMetadataFormTextControl,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { range } from '@app/core/utils';

export const guarantorFormConfig: IMetadataFormConfig = {
  id: 'guaranteeCardGuarantorForm',
  editable: true,
  items: [
    {
      dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE,
      disabled: false,
      display: true,
      label: 'Тип',
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
      label: 'Фамилия/Название',
      name: 'lastName',
      type: IMetadataFormControlType.TEXT,
      validators: {
        required: true,
      },
      width: 0,
    },
    {
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Имя',
      name: 'firstName',
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    },
    {
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Отчество',
      name: 'middleName',
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    },
    {
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Дата рождения',
      name: 'birthDate',
      type: IMetadataFormControlType.DATE,
      validators: {},
      width: 0,
    },
    {
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Место рождения',
      name: 'birthPlace',
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    },
    {
      dictCode: UserDictionariesService.DICTIONARY_GENDER,
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Пол',
      name: 'genderCode',
      type: IMetadataFormControlType.SELECT,
      validators: {},
      width: 0,
    },
    {
      dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Семейное положение',
      name: 'familyStatusCode',
      type: IMetadataFormControlType.SELECT,
      validators: {},
      width: 0,
    },
    {
      dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
      disabled: false,
      display: {
        type: IContextConfigItemType.STATE,
        method: IContextByStateMethod.EQUALS,
        key: 'guaranteeCardGuarantorForm.value.typeCode',
        value: 1,
      },
      label: 'Образование',
      name: 'educationCode',
      type: IMetadataFormControlType.SELECT,
      validators: {},
      width: 0,
    },
    ...range(1, 10).map(i => ({
      disabled: false,
      display: {
        type: IContextConfigItemType.GROUP,
        operator: IContextConfigOperator.AND,
        children: [
          {
            type: IContextConfigItemType.ENTITY,
            method: IContextByEntityMethod.IS_USED,
            value: 363 + i,
          },
          {
            type: IContextConfigItemType.CONSTANT,
            method: IContextByValueBagMethod.CONTAINS,
            name: {
              type: IContextConfigItemType.EXPRESSION,
              method: IContextByExpressionMethod.SWITCH,
              key: {
                type: IContextConfigItemType.STATE,
                method: IContextByStateMethod.VALUE,
                key: 'guaranteeCardGuarantorForm.value.typeCode',
              },
              value: {
                1: 'Person.Individual.AdditionalAttribute.List',
                2: 'Person.LegalEntity.AdditionalAttribute.List',
                3: 'Person.SoleProprietorship.AdditionalAttribute.List',
              },
            },
            value: 363 + i,
          }
        ],
      },
      label: `Строковый атрибут ${i}`,
      name: `stringValue${i}`,
      type: IMetadataFormControlType.TEXT,
      validators: {},
      width: 0,
    }) as IMetadataFormTextControl),
    {
      disabled: false,
      display: true,
      label: 'Комментарий',
      name: 'comment',
      type: IMetadataFormControlType.TEXTAREA,
      validators: {},
      width: 0,
    },
  ],
  plugins: [],
};
