import { FormControl, ValidatorFn } from '@angular/forms';

import { IDialogMultiSelectFilterType } from '../dialog-multi-select/dialog-multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';
import { ILabeledValue } from '@app/core/converter/value-converter.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';
import { IMultiLanguageOption, IMultiLanguageConfig } from '@app/shared/components/form/multi-language/multi-language.interface';
import { IRadioGroupOption } from '../radio-group/radio-group.interface';
import { ISegmentedInputOption } from '../segmented-input/segmented-input.interface';
import { ISelectionAction } from '../select/select.interface';
import { FilterOperatorType } from '@app/shared/components/grid2/filter/grid-filter';

export interface IValidationMessages {
  [key: string]: string;
}

export interface IFilterEntry {
  [key: string]: any;
}

export interface IFilterParam {
  [key: string]: any;
}

export type IDynamicFormItem = IDynamicFormGroup | IDynamicFormControl;

export type IDynamicFormControl =
  // IDynamicFormBaseControl
  IDynamicFormButtonControl |
  IDynamicFormDateControl |
  IDynamicFormDialogMultiSelectControl |
  IDynamicFormFileControl |
  IDynamicFormGridSelectControl |
  IDynamicFormImageControl |
  IDynamicFormLanguageControl |
  IDynamicFormNumberControl |
  IDynamicFormRadioControl |
  IDynamicFormRichTextControl |
  IDynamicFormSegmentedInputControl |
  IDynamicFormSelectControl |
  IDynamicFormTextControl |
  IDynamicFormTextareaControl
  ;

export interface IDynamicFormConfig {
  labelKey?: string;
  suppressLabelCreation?: boolean;
}

export interface IDynamicFormGroup {
  children: IDynamicFormItem[];
  collapsible?: boolean;
  display?: boolean;
  title?: string;
  width?: number;
}

export interface IDynamicFormBaseControl {
  // type: TControlTypes;
  controlName?: string;
  children?: IDynamicFormControl[];
  disabled?: boolean;
  // `display: false` will place the control on the form and hide it
  display?: boolean;
  iconCls?: string;
  label?: string;
  // set `markAsDirty: true` if the control is initialized with a value
  markAsDirty?: boolean;
  onChange?: (value: any) => void;
  readonly?: boolean;
  required?: boolean;
  validators?: Array<ValidatorFn>;
  validationMessages?: IValidationMessages;
  // the width can take a number from 1 to 12 (we are using the bootstrap grid)
  width?: number;
}

export interface IDynamicFormButtonControl extends IDynamicFormBaseControl {
  // options for dialog input, button, searchBtn
  type: 'button' | 'searchBtn' | 'dialog';
  action?: () => void;
  placeholder?: string;
}

export interface IDynamicFormDateControl extends IDynamicFormBaseControl {
  // options for date controls
  type: 'datepicker';
  displayTime?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  dependsOn?: string;
}

export interface IDynamicFormFileControl extends IDynamicFormBaseControl {
  type: 'file';
  fileName?: string;
  placeholder?: string;
}

export interface IDynamicFormGridSelectControl extends IDynamicFormBaseControl {
  // options for grid select
  type: 'gridselect';
  gridRows?: Array<any>;
  gridLabelGetter?: Function;
  gridValueGetter?: Function;
  gridOnSelect?: Function;
  gridColumns?: IGridColumn[];
  placeholder?: string;
}

export interface IDynamicFormImageControl extends IDynamicFormBaseControl {
  type: 'image';
  // image height in px
  height?: number;
  // image url
  url: string;
  placeholder?: string;
}

export interface IDynamicFormLanguageControl extends IDynamicFormBaseControl {
  type: 'multilanguage';
  // options for multilanguage
  langOptions?: IMultiLanguageOption[];
  langConfig?: IMultiLanguageConfig;
}

export interface IDynamicFormDialogMultiSelectControl extends IDynamicFormBaseControl {
  type: 'dialogmultiselect' | 'dialogmultiselectwrapper';
  // options for dialog multiselect
  filterType?: IDialogMultiSelectFilterType;
  placeholder?: string;
  dependsOn?: string;
}

export interface IDynamicFormNumberControl extends IDynamicFormBaseControl {
  type: 'number';
  // min & max value for number
  min?: number;
  max?: number;
  placeholder?: string;
  dependsOn?: string;
}

export interface IDynamicFormRadioControl extends IDynamicFormBaseControl {
  type: 'radio' | 'boolean';
  // options for radio group
  radioOptions?: Array<IRadioGroupOption>;
  dependsOn?: string;
}

export interface IDynamicFormRichTextControl extends IDynamicFormBaseControl {
  // @deprecated `richtexteditor`
  type: 'richtexteditor' | 'texteditor';
  // options for rich text editor
  codeMode?: boolean;
  onInit?: Function;
  richTextMode?: boolean;
  toolbar?: boolean;
}

export interface IDynamicFormSegmentedInputControl extends IDynamicFormBaseControl {
  type: 'segmented';
  // options for segmented input
  segmentedInputOptions?: ISegmentedInputOption[];
}

export interface IDynamicFormSelectControl extends IDynamicFormBaseControl {
  type: 'select' | 'selectwrapper' | 'singleselectwrapper' | 'multiselect' | 'multiselectwrapper';
  // options for select controls
  multiple?: boolean;
  closableSelectedItem?: boolean;
  options?: ILabeledValue[];
  optionsActions?: Array<ISelectionAction>;
  optionsRenderer?: (label: string, item: ILabeledValue) => string;
  placeholder?: string;
  dependsOn?: string;
  // @deprecated options for select wrappers
  dictCode?: number;
  parentCode?: number;
  lookupKey?: ILookupKey;
}

export interface IDynamicFormTextControl extends IDynamicFormBaseControl {
  type: 'text' | 'password' | 'htmltextarea' | 'checkbox' | 'colorpicker' | 'dynamic';
  placeholder?: string;
  dependsOn?: string;
}

export interface IDynamicFormTextareaControl extends IDynamicFormBaseControl {
  type: 'textarea';
  // number of rows for textarea, defaults to 2
  rows?: number;
  placeholder?: string;
  dependsOn?: string;
}

export interface IFilterControl {
  label: string;
  controlName: string;
  type: TControlTypes;
  filterType: IDialogMultiSelectFilterType;
  dictCode?: number;
  width?: number;
  iconCls?: string;
  operator: FilterOperatorType;
  filterParams?: IFilterParam;
  display?: boolean;
}

/**
 * @deprecated
 */
export interface IDynamicFormControlOld {
  // type: TControlTypes;
  children?: IDynamicFormControl[];
  controlName?: string;
  dependsOn?: string;
  disabled?: boolean;
  display?: boolean;
  displayTime?: boolean;
  iconCls?: string;
  label: string;
  // markAsDirty if the control is passed a value
  markAsDirty?: boolean;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  onChange?: (value: any) => void;
  // options for select controls
  multiple?: boolean;
  closableSelectedItem?: boolean;
  options?: ILabeledValue[];
  optionsActions?: Array<ISelectionAction>;
  optionsRenderer?: (label: string, item: ILabeledValue) => string;
  // options for multilanguage
  langOptions?: IMultiLanguageOption[];
  langConfig?: IMultiLanguageConfig;
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
  // options for grid select
  gridRows?: Array<any>;
  gridLabelGetter?: Function;
  gridValueGetter?: Function;
  gridOnSelect?: Function;
  gridColumns?: IGridColumn[];
  // options for dialog multiselect
  filterType?: IDialogMultiSelectFilterType;
  // options for radio group
  radioOptions?: Array<IRadioGroupOption>;
  // options for rich text editor
  onInit?: Function;
  toolbar?: boolean;
  richTextMode?: boolean;
  codeMode?: boolean;
  // options for segmented input
  segmentedInputOptions?: ISegmentedInputOption[];
  // min & max value for number input
  min?: number;
  max?: number;
}

/**
 * To make the control `hidden` set `type: <any>` and `display: false`
 */
export type TControlTypes =
    'boolean'
  | 'button'
  | 'checkbox'
  | 'colorpicker'
  | 'datepicker'
  | 'dialog'
  | 'dialogmultiselect'
  | 'dialogmultiselectwrapper'
  | 'dynamic'
  | 'file'
  | 'gridselect'
  | 'htmltextarea'
  | 'image'
  | 'multilanguage'
  | 'multiselect'
  | 'multiselectwrapper'
  | 'number'
  | 'password'
  | 'radio'
  | 'richtexteditor'
  | 'searchBtn'
  | 'segmented'
  | 'select'
  | 'selectwrapper'
  | 'singleselectwrapper'
  | 'text'
  | 'textarea'
  | 'texteditor'
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
