import { FormControl, ValidatorFn } from '@angular/forms';

import { ISelectionAction } from '../select/select-interfaces';
import { ILabeledValue } from '../../../../core/converter/value/value-converter.interface';

export interface IValidationMessages {
  [key: string]: string;
}

export type IDynamicFormItem = IDynamicFormGroup | IDynamicFormControl;

export interface IDynamicFormGroup {
  children: Array<IDynamicFormItem>;
  collapsible?: boolean;
  title?: string;
  width?: number;
}

export interface IDynamicFormControl {
  label: string;
  controlName?: string;
  type: ControlTypes;
  dependsOn?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  // options for select controls
  multiple?: boolean;
  closableSelectedItem?: boolean;
  options?: ILabeledValue[];
  optionsActions?: Array<ISelectionAction>;
  optionsRenderer?: (label: string, item: ILabeledValue) => string;
  // number of rows for textarea
  rows?: number;
  validators?: Array<ValidatorFn>;
  validationMessages?: IValidationMessages;
  width?: number;
  // image height (px)
  height?: number;
  // options for dialog input
  action?: () => void;
}

export type ControlTypes = 'number'
  | 'text'
  | 'textarea'
  | 'select'
  | 'datepicker'
  | 'boolean'
  | 'dynamic'
  | 'hidden'
  | 'checkbox'
  | 'multiselect'
  | 'image'
  | 'dialog';

export interface IValue {
  [key: string]: any;
}

export interface IControls {
  [key: string]: FormControl;
}

export interface ISelectItemsPayload {
  control: IDynamicFormControl;
  items: ILabeledValue[];
}
