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
  label: string;
  name: string;
  validators?: ValidatorFn | Array<ValidatorFn>;
  width?: number;
}

export interface IDynamicFormGroup extends IDynamicFormGenericControl {
  type: 'group';
  children: Array<IDynamicFormItem>;
  isCollapsible: boolean;
}

export interface IDynamicFormTextControl extends IDynamicFormGenericControl {
  type: 'text';
}

export interface IDynamicFormDatepickerControl extends IDynamicFormGenericControl {
  type: 'datepicker';
}

export interface IDynamicFormSelectControl extends IDynamicFormGenericControl {
  type: 'select';
  options: Array<IDynamicFormOption>;
}

export interface IDynamicFormRadioControl extends IDynamicFormGenericControl {
  type: 'radio';
  options: Array<IDynamicFormOption>;
}

export type IDynamicFormControl =
  IDynamicFormTextControl |
  IDynamicFormDatepickerControl |
  IDynamicFormSelectControl |
  IDynamicFormRadioControl;

export type IDynamicFormItem = IDynamicFormControl | IDynamicFormGroup;
