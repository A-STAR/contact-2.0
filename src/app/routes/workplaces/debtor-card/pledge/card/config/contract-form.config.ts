import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

export const contractFormConfig: IMetadataFormConfig = {
  id: 'pledgeCardContractForm',
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
