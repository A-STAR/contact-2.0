import { IContextConfig } from '@app/core/context/context.interface';

export type IMetadataFormValidator<T> = T | IContextConfig;

export enum IMetadataFormControlType {
  GROUP    = 'group',
  PASSWORD = 'password',
  TEXT     = 'text',
}

export interface IMetadataFormGenericControl {
  disabled: IMetadataFormValidator<boolean>;
  display: IMetadataFormValidator<boolean>;
  label: string;
  name: string;
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

export interface IMetadataFormPasswordControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.PASSWORD;
  validators: {
    complexity?: IMetadataFormValidator<number>;
    maxLength?: IMetadataFormValidator<number>;
    minLength?: IMetadataFormValidator<number>;
    required?: IMetadataFormValidator<boolean>;
  };
}

export interface IMetadataFormGroup {
  children: IMetadataFormItem[];
  type: IMetadataFormControlType.GROUP;
}

export type IMetadataFormControl = IMetadataFormTextControl | IMetadataFormPasswordControl;

export type IMetadataFormItem = IMetadataFormControl | IMetadataFormGroup;

export interface IMetadataFormConfig {
  editable: boolean;
  items: IMetadataFormItem[];
}
