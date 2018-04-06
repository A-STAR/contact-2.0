import { IContextConfig } from '@app/core/context/context.interface';
import { IDialogMultiSelectFilterType } from '@app/shared/components/form/dialog-multi-select/dialog-multi-select.interface';
import { IFilterParam } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

export type IMetadataFormValidator<T> = T | IContextConfig;


// Items:

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

export enum IMetadataFormGroupType {
  PLAIN = 'plain',
  TABS  = 'tabs',
}

export interface IMetadataFormGroup {
  border: boolean;
  children: IMetadataFormItem[];
  display: IMetadataFormValidator<boolean>;
  groupType: IMetadataFormGroupType;
  label: string;
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


// Events:

export enum IMetadataFormEventType {
  GRIDSELECT,
}

export interface IMetadataFormGenericEvent {
  type: IMetadataFormEventType;
  control: IMetadataFormControl;
}

export interface IMetadataFormGridSelectEvent extends IMetadataFormGenericEvent {
  type: IMetadataFormEventType.GRIDSELECT;
  control: IMetadataFormGridSelectControl;
  row: { [key: string]: any; };
}

export type IMetadataFormEvent = IMetadataFormGridSelectEvent;


// Plugins:

export enum IMetadataFormPluginType {
  LINK_GRIDSELECT = 'link-gridselect',
}

export interface IMetadataFormGenericPlugin {
  type: IMetadataFormPluginType;
}

export interface IMetadataFormGridSelectLinkPlugin extends IMetadataFormGenericPlugin {
  type: IMetadataFormPluginType.LINK_GRIDSELECT;
  from: string;
  to: string;
  key: string;
}

export type IMetadataFormPlugin = IMetadataFormGridSelectLinkPlugin;

export interface IMetadataFormConfig {
  editable: boolean;
  items: IMetadataFormItem[];
  plugins: IMetadataFormPlugin[];
}
