import { FormControl, ValidatorFn } from '@angular/forms';

import { IGridColumn } from '../../grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { ISelectionAction } from '../select/select-interfaces';


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
  dependsOn?: string;
  disabled?: boolean;
  label: string;
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
  | 'select'
  | 'text'
  | 'textarea'
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
