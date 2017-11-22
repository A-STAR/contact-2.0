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
  type: TControlTypes;
  onChange?: (value: any) => void;
  // options for select controls
  multiple?: boolean;
  closableSelectedItem?: boolean;
  options?: ILabeledValue[];
  optionsActions?: Array<ISelectionAction>;
  optionsRenderer?: (label: string, item: ILabeledValue) => string;
  // options for select wrapper
  dictCode?: number;
  parentCode?: number;
  lookupKey?: ILookupKey;
  // number of rows for textarea
  rows?: number;
  validators?: Array<ValidatorFn>;
  validationMessages?: IValidationMessages;
  width?: number;
  // image height (px)
  height?: number;
  // image url
  url?: string;
  // options for dialog input
  action?: () => void;
  // options for grid select and dialog multiselect
  gridRows?: Array<any>;
  gridLabelGetter?: Function;
  gridValueGetter?: Function;
  gridOnSelect?: Function;
  // options for grid select
  gridColumns?: IGridColumn[];
  // options for dialog multiselect
  gridColumnsFrom?: IGridColumn[];
  gridColumnsTo?: IGridColumn[];
  // options for radio group
  radioOptions?: Array<IRadioGroupOption>;
  // options for rich text editor
  onInit?: (control: RichTextEditorComponent) => void;
  toolbar?: boolean;
  // options for segmented input
  segmentedInputOptions?: ISegmentedInputOption[];
  // min & max value for number input
  min?: number;
  max?: number;
}

export type TControlTypes =
    'boolean'
  | 'button'
  | 'checkbox'
  | 'colorpicker'
  | 'datepicker'
  | 'dialog'
  | 'dialogmultiselect'
  | 'dynamic'
  | 'file'
  | 'gridselect'
  | 'hidden'
  | 'image'
  | 'multiselect'
  | 'multiselectwrapper'
  | 'multitext'
  | 'number'
  | 'password'
  | 'radio'
  | 'richtexteditor'
  | 'segmented'
  | 'select'
  | 'selectwrapper'
  | 'singleselectwrapper'
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
