import { IContextConfig } from '@app/core/context/context.interface';
import { IDialogMultiSelectFilterType } from '@app/shared/components/form/dialog-multi-select/dialog-multi-select.interface';
import { IFilterParam } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

export type IMetadataFormValidator<T> = T | IContextConfig;

export enum IMetadataFormControlType {
  CHECKBOX   = 'checkbox',
  DATE       = 'date',
  GRIDSELECT = 'gridselect',
  GROUP      = 'group',
  PASSWORD   = 'password',
  SELECT     = 'select',
  TEXT       = 'text',
  TEXTAREA   = 'textarea',
}

export interface IMetadataFormGroup {
  children: IMetadataFormItem[];
  type: IMetadataFormControlType.GROUP;
  width: number;
}

export interface IMetadataFormGenericControl {
  disabled: IMetadataFormValidator<boolean>;
  display: IMetadataFormValidator<boolean>;
  label: string;
  name: string;
  type: IMetadataFormControlType;
  width: number;
}

export interface IMetadataFormCheckboxControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.CHECKBOX;
  validators: {};
}

export interface IMetadataFormDateControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.DATE;
  validators: {
    required?: IMetadataFormValidator<boolean>;
  };
}

export interface IMetadataFormGridSelectControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.GRIDSELECT;
  filterType: IDialogMultiSelectFilterType;
  filterParams: IFilterParam;
  validators: {
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

export interface IMetadataFormSelectControl extends IMetadataFormGenericControl {
  dictCode?: number;
  lookupKey?: ILookupKey;
  type: IMetadataFormControlType.SELECT;
  validators: {
    required?: IMetadataFormValidator<boolean>;
  };
}

export interface IMetadataFormTextControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.TEXT;
  validators: {
    maxLength?: IMetadataFormValidator<number>;
    minLength?: IMetadataFormValidator<number>;
    required?: IMetadataFormValidator<boolean>;
  };
}

export interface IMetadataFormTextareaControl extends IMetadataFormGenericControl {
  type: IMetadataFormControlType.TEXTAREA;
  validators: {
    maxLength?: IMetadataFormValidator<number>;
    minLength?: IMetadataFormValidator<number>;
    required?: IMetadataFormValidator<boolean>;
  };
}

export type IMetadataFormControl =
  | IMetadataFormCheckboxControl
  | IMetadataFormDateControl
  | IMetadataFormGridSelectControl
  | IMetadataFormPasswordControl
  | IMetadataFormSelectControl
  | IMetadataFormTextControl
  | IMetadataFormTextareaControl
;

export type IMetadataFormItem = IMetadataFormControl | IMetadataFormGroup;

export enum IMetadataFormPluginType {
  LINK = 'link',
}

export interface IMetadataFormLinkPlugin {
  type: IMetadataFormPluginType.LINK;
}

export type IMetadataFormPlugin = IMetadataFormLinkPlugin;

export interface IMetadataFormConfig {
  editable: boolean;
  items: IMetadataFormItem[];
  plugins: IMetadataFormPlugin[];
}
