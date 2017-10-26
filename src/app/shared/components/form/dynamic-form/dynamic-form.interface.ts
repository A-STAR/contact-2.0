import { FormControl, ValidatorFn } from '@angular/forms';

import { IGridColumn } from '../../grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { ILookupKey } from '../../../../core/lookup/lookup.interface';
import { ISegmentedInputOption } from '../segmented-input/segmented-input.interface';
import { ISelectionAction } from '../select/select.interface';
import { IRadioGroupOption } from '../radio-group/radio-group.interface';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';

export interface IValidationMessages {
  [key: string]: string;
}

export type IDynamicFormItem = IDynamicFormGroup | IDynamicFormControl;

export interface IDynamicFormGroup {
  display?: boolean;
  children: IDynamicFormItem[];
  collapsible?: boolean;
  title?: string;
  width?: number;
}

export interface IDynamicFormControl {
  display?: boolean;
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
  onChange?: (value: any) => void;
  // options for select controls
  multiple?: boolean;
  closableSelectedItem?: boolean;
  options?: ILabeledValue[];
  optionsActions?: Array<ISelectionAction>;
  optionsRenderer?: (label: string, item: ILabeledValue) => string;
  // options for select wrapper
  dictCode?: number;
  lookupKey?: ILookupKey;
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
  | 'colorpicker'
  | 'datepicker'
  | 'dialog'
  | 'dynamic'
  | 'file'
  | 'gridselect'
  | 'hidden'
  | 'image'
  | 'multiselect'
  | 'multitext'
  | 'number'
  | 'password'
  | 'radio'
  | 'richtexteditor'
  | 'select'
  | 'selectwrapper'
  | 'singleselect'
  | 'text'
  | 'textarea'
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
