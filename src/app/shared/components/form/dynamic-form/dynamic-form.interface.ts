import { FormControl, ValidatorFn } from '@angular/forms';

import { IGridColumn } from '../../grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { ISegmentedInputOption } from '../segmented-input/segmented-input.interface';
import { ISelectionAction } from '../select/select.interface';
import { IRadioGroupOption } from '../radio-group/radio-group.interface';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';

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
  displayTime?: boolean;
  dependsOn?: string;
  disabled?: boolean;
  iconCls?: string;
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
  // options for rich text editor
  onInit?: (control: RichTextEditorComponent) => void;
  toolbar?: boolean;
  // options for segmented input
  segmentedInputOptions?: ISegmentedInputOption[];
}

export type ControlTypes =
    'boolean'
  | 'button'
  | 'checkbox'
  | 'datepicker'
  | 'dialog'
  | 'dynamic'
  | 'file'
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
  | 'richtexteditor'
  | 'segmented'
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
