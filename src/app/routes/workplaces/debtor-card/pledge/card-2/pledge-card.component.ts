import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
  IMetadataFormTextControl,
  IFormContextConfigOperator,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { range } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-pledge-card',
  templateUrl: 'pledge-card.component.html'
})
export class PledgeCardComponent {
  readonly contractForm: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'Номер договора',
        name: 'contractNumber',
        type: IMetadataFormControlType.TEXT,
        validators: {
          required: true,
        },
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Начало',
        name: 'contractStartDate',
        type: IMetadataFormControlType.DATE,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Окончание',
        name: 'contractEndDate',
        type: IMetadataFormControlType.DATE,
        validators: {},
        width: 0,
      },
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

  readonly pledgorForm: IMetadataFormConfig = {
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
          field: 'typeCode',
          operator: IFormContextConfigOperator.EQUALS,
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
        display: true,
        label: 'Отчество',
        name: 'middleName',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Дата рождения',
        name: 'birthDate',
        type: IMetadataFormControlType.DATE,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Место рождения',
        name: 'birthPlace',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        dictCode: UserDictionariesService.DICTIONARY_GENDER,
        disabled: false,
        display: true,
        label: 'Пол',
        name: 'genderCode',
        type: IMetadataFormControlType.SELECT,
        validators: {},
        width: 0,
      },
      {
        dictCode: UserDictionariesService.DICTIONARY_FAMILY_STATUS,
        disabled: false,
        display: true,
        label: 'Семейное положение',
        name: 'familyStatusCode',
        type: IMetadataFormControlType.SELECT,
        validators: {},
        width: 0,
      },
      {
        dictCode: UserDictionariesService.DICTIONARY_EDUCATION,
        disabled: false,
        display: true,
        label: 'Образование',
        name: 'educationCode',
        type: IMetadataFormControlType.SELECT,
        validators: {},
        width: 0,
      },
      ...range(1, 10).map(i => ({
        disabled: false,
        display: true,
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

  readonly propertyForm: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'Название',
        name: 'propertyName',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
      {
        disabled: false,
        display: true,
        label: 'Тип имущества',
        name: 'propertyType',
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
        validators: {},
        width: 0,
      },
    ],
    plugins: [],
  };
}
