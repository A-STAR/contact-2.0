import { Observable } from 'rxjs/Observable';

export interface IDynamicFormControl {
  label: string;
  controlName: string;
  type: ControlTypes;
  dependsOn?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  // options for select controls
  options?: Array<ISelectOptions>;
  lazyOptions?: Observable<Array<ISelectOptions>>;
  cachingOptions?: boolean;
  // number of rows for textarea
  rows?: number;
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
