import { ValidatorFn } from '@angular/forms';

export interface IDynamicFormOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type IDynamicFormFieldValue = string | number;

export interface IDynamicFormValue {
  [key: string]: IDynamicFormFieldValue;
}

export interface IDynamicFormGenericItem {
  name: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  validators?: ValidatorFn | Array<ValidatorFn>;
  width?: number;
}

export interface IDynamicFormGroup extends IDynamicFormGenericItem {
  type: 'group';
  children: Array<IDynamicFormItem>;
  bordered?: boolean;
  translationKey?: string;
}

export interface IDynamicFormGenericControl extends IDynamicFormGenericItem {
  display?: boolean;
  onChange?: (value: IDynamicFormFieldValue) => void;
}

export interface IDynamicFormTextControl extends IDynamicFormGenericControl {
  type: 'text';
  placeholder: string;
}

export interface IDynamicFormTextAreaControl extends IDynamicFormGenericControl {
  type: 'textarea';
  placeholder: string;
  nRows: number;
}

export interface IDynamicFormSelectControl extends IDynamicFormGenericControl {
  type: 'select';
  options: Array<IDynamicFormOption>;
  placeholder: string;
}

export interface IDynamicFormCheckboxControl extends IDynamicFormGenericControl {
  type: 'checkbox';
}

export interface IDynamicFormRadioGroupControl extends IDynamicFormGenericControl {
  type: 'radio';
  options: Array<IDynamicFormOption>;
}

export type IDynamicFormControl =
  IDynamicFormCheckboxControl |
  IDynamicFormRadioGroupControl |
  IDynamicFormSelectControl |
  IDynamicFormTextControl |
  IDynamicFormTextAreaControl;

export type IDynamicFormItem = IDynamicFormControl | IDynamicFormGroup;
