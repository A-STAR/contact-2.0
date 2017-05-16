import { FormControl, ValidatorFn } from '@angular/forms';

export interface IDynamicFormControl {
  label: string;
  controlName: string;
  type: ControlTypes;
  dependsOn?: string;
  required?: boolean;
  disabled?: boolean;
  // options for select controls
  options?: Array<ISelectOptions>;
  // number of rows for textarea
  rows?: number;
  value?: any;
  validators?: Array<ValidatorFn>;
}

export type ControlTypes = 'number' | 'text' | 'textarea' | 'select' | 'datepicker' | 'boolean' | 'dynamic' | 'hidden';

export interface ISelectOptions {
  label: string;
  value: any;
  selected?: boolean;
}

export interface IValue {
  [key: string]: any;
}

export interface IControls {
  [key: string]: FormControl;
}
