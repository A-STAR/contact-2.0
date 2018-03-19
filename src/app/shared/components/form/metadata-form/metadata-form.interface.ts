export type IMetadataFormValidator<T> = T | string;

export enum IMetadataFormControlType {
  GROUP = 'group',
  TEXT = 'text',
}

export interface IMetadataFormGenericControl {
  display: boolean;
  label: string;
  name: string;
  required: boolean;
  type: IMetadataFormControlType;
}

export interface IMetadataFormTextControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.TEXT;
  validators: {
    maxLength?: IMetadataFormValidator<number>;
    minLength?: IMetadataFormValidator<number>;
    required?: IMetadataFormValidator<boolean>;
  };
}

export interface IMetadataFormGroup {
  children: IMetadataFormItem[];
  type: IMetadataFormControlType.GROUP;
}

export type IMetadataFormControl = IMetadataFormTextControl;

export type IMetadataFormItem = IMetadataFormControl | IMetadataFormGroup;

export interface IMetadataFormConfig {
  editable: boolean;
  items: IMetadataFormItem[];
}
