export type IMetadataFormValidator<T> = T | string;

export enum IMetadataFormControlType {
  GROUP = 'group',
  TEXT = 'text',
}

export interface IMetadataFormTextControl {
  display: boolean;
  label: string;
  max: IMetadataFormValidator<number>;
  min: IMetadataFormValidator<number>;
  name: string;
  required: IMetadataFormValidator<boolean>;
  type: IMetadataFormControlType.TEXT;
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
