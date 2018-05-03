import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

export const linkFormConfig: IMetadataFormConfig = {
  id: 'contactPersonCardLinkForm',
  editable: true,
  items: [
    {
      dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE,
      disabled: false,
      display: true,
      label: 'Тип связи',
      name: 'linkTypeCode',
      type: IMetadataFormControlType.SELECT,
      validators: {
        required: true,
      },
      width: 0,
    },
  ],
  plugins: [],
};
