export type IMetadataFormValidator<T> = T | string;

export enum IMetadataFormControlType {
  GROUP = 'group',
  TEXT = 'text',
}

export interface IMetadataFormTextControl {
  display: boolean;
  label: string;
  name: string;
  type: IMetadataFormControlType.TEXT;
  validators: {
    maxLength: IMetadataFormValidator<number>;
    minLength: IMetadataFormValidator<number>;
    required: IMetadataFormValidator<boolean>;
  };
}

export interface IMetadataFormGroup {
  children: IMetadataFormItem[];
  type: IMetadataFormControlType.GROUP;
}

export type IMetadataFormControl = IMetadataFormTextControl;

export type IMetadataFormItem = IMetadataFormControl | IMetadataFormGroup;

export interface IMetadataFormConfig {
  items: IMetadataFormItem[];
}
