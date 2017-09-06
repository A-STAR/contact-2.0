import { FormControl, ValidatorFn } from '@angular/forms';

import { IGridColumn } from '../../grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { ISelectionAction } from '../select/select.interface';
import { IRadioGroupOption } from '../radio-group/radio-group.interface';

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
  children?: IDynamicFormControl[];
  controlName?: string;
  dateOnly?: boolean;
  dependsOn?: string;
  disabled?: boolean;
  label: string;
  // markAsDirty if the control is passed a value
  markAsDirty?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  type: ControlTypes;
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
  // options for grid select
  gridColumns?: Array<IGridColumn>;
  gridRows?: Array<any>;
  gridLabelGetter?: Function;
  gridValueGetter?: Function;
  gridOnSelect?: Function;
  // options for radio group
  radioOptions?: Array<IRadioGroupOption>;
}

export type ControlTypes =
    'boolean'
  | 'checkbox'
  | 'datepicker'
  | 'dialog'
  | 'dynamic'
  | 'gridselect'
  | 'hidden'
  | 'image'
  | 'multiselect'
  | 'number'
  | 'password'
  | 'radio'
  | 'select'
  | 'text'
  | 'textarea'
  | 'file'
;

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
