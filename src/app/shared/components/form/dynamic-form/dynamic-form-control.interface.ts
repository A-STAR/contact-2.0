import { FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ISelectionAction } from '../select/select-interfaces';

export interface IValidationMessages {
  [key: string]: string;
}

export interface IDynamicFormControl {
  label: string;
  controlName: string;
  type: ControlTypes;
  dependsOn?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  // options for select controls
  options?: Array<ISelectOptions>;
  lazyOptions?: Observable<Array<ISelectOptions>>;
  cachingOptions?: boolean;
  optionsActions?: Array<ISelectionAction>;
  // number of rows for textarea
  rows?: number;
  validators?: Array<ValidatorFn>;
  validationMessages?: IValidationMessages;
}

export type ControlTypes = 'number' | 'text' | 'textarea' | 'select' | 'datepicker' | 'boolean' | 'dynamic' | 'hidden' | 'checkbox';

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
