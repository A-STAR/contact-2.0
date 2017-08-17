import { ValidatorFn } from '@angular/forms';

export interface IDynamicFormOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface IDynamicFormValue {
  [key: string]: string | number | Date | Array<string> | Array<number>;
}

export interface IDynamicFormGenericControl {
  name: string;
  label?: string;
  required?: boolean;
  validators?: ValidatorFn | Array<ValidatorFn>;
  width?: number;
}

export interface IDynamicFormGroup extends IDynamicFormGenericControl {
  type: 'group';
  children: Array<IDynamicFormItem>;
  bordered?: boolean;
  translationKey?: string;
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

export type IDynamicFormControl =
  IDynamicFormCheckboxControl |
  IDynamicFormSelectControl |
  IDynamicFormTextControl |
  IDynamicFormTextAreaControl;

export type IDynamicFormItem = IDynamicFormControl | IDynamicFormGroup;
