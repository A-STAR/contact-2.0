import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

export const contractFormConfig: IMetadataFormConfig = {
  id: 'guaranteeCardContractForm',
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
      dictCode: UserDictionariesService.DICTIONARY_GUARANTOR_RESPONSIBILITY_TYPE,
      disabled: false,
      display: true,
      label: 'Тип ответственности',
      name: 'contractTypeCode',
      type: IMetadataFormControlType.SELECT,
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
