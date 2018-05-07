import { FormControl, ValidatorFn } from '@angular/forms';

import { IDialogMultiSelectFilterType } from '../dialog-multi-select/dialog-multi-select.interface';
import { ILabeledValue } from '@app/core/converter/value-converter.interface';
import { ILookupKey } from '@app/core/lookup/lookup.interface';
import { IMultiLanguageConfig } from '@app/shared/components/form/multilanguage/multilanguage.interface';
import { IRadioGroupOption } from '../radio-group/radio-group.interface';
import { ISegmentedInputOption } from '../segmented-input/segmented-input.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IScriptEditorConfig } from '@app/shared/components/form/script-editor/script-editor.interface';

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
  // all those are children of `IDynamicFormBaseControl`
  IDynamicFormButtonControl |
  IDynamicFormDateControl |
  IDynamicFormDateTimeControl |
  IDynamicFormDebtAmountControl |
  IDynamicFormDialogMultiSelectControl |
  IDynamicFormFileControl |
  IDynamicFormGridSelectControl |
  IDynamicFormImageControl |
  IDynamicFormLanguageControl |
  IDynamicFormMultiSelectControl |
  IDynamicFormNumberControl |
  IDynamicFormRadioControl |
  IDynamicFormRangeControl |
  IDynamicFormRichTextControl |
  IDynamicFormSegmentedInputControl |
  IDynamicFormSelectControl |
  IDynamicFormScriptControl |
  IDynamicFormTextControl |
  IDynamicFormTextareaControl |
  IDynamicFormTimeControl
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
  // set `markAsDirty: true` if you need the control to deliver its initial value
  // when using the form's `serializedUpdates` getter
  markAsDirty?: boolean;
  onChange?: (value: any) => void;
  required?: boolean;
  readonly?: boolean;
  validators?: ValidatorFn[];
  validationMessages?: IValidationMessages;
  // the width can take a number from 1 to 12 (we are using the bootstrap grid)
  width?: number;
}

export interface IDynamicFormButtonControl extends IDynamicFormBaseControl {
  // options for dialog input, button, searchBtn
  type: 'button' | 'searchBtn' | 'dialog';
  action?: () => void;
}

export interface IDynamicFormDateTimeControl extends IDynamicFormBaseControl {
  // options for datetime controls
  type: 'datetimepicker';
  displaySeconds?: boolean;
  minDateTime?: Date;
  maxDateTime?: Date;
}

export interface IDynamicFormDateControl extends IDynamicFormBaseControl {
  // options for date controls
  type: 'datepicker';
  minDate?: Date;
  maxDate?: Date;
}

export interface IDynamicFormTimeControl extends IDynamicFormBaseControl {
  // options for time controls
  type: 'timepicker';
  displaySeconds?: boolean;
  minTime?: Date;
  maxTime?: Date;
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
  gridColumns?: ISimpleGridColumn<any>[];
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
  langConfig?: IMultiLanguageConfig;
  createMode?: boolean;
}

export interface IDynamicFormDialogMultiSelectControl extends IDynamicFormBaseControl {
  type: 'dialogmultiselect';
  // options for dialog multiselect
  filterType?: IDialogMultiSelectFilterType;
  filterParams?: IFilterParam;
  placeholder?: string;
}

export interface IDynamicFormNumberControl extends IDynamicFormBaseControl {
  type: 'number';
  // min & max value for number
  min?: number;
  max?: number;
  placeholder?: string;
  positive?: boolean;
}

export interface IDynamicFormRangeControl extends IDynamicFormBaseControl {
  type: 'range';
  min?: number;
  max?: number;
  debounce?: number;
}

export interface IDynamicFormRadioControl extends IDynamicFormBaseControl {
  type: 'radio' | 'boolean';
  // options for radio group
  radioOptions?: Array<IRadioGroupOption>;
}

export interface IDynamicFormRichTextControl extends IDynamicFormBaseControl {
  type: 'texteditor';
  // options for rich text editor
  codeMode?: boolean;
  onInit?: Function;
  richTextMode?: boolean;
  toolbar?: boolean;
}

export interface IDynamicFormScriptControl extends IDynamicFormBaseControl {
  type: 'scripteditor';
  options?: IScriptEditorConfig[];
}

export interface IDynamicFormSegmentedInputControl extends IDynamicFormBaseControl {
  type: 'segmented';
  // options for segmented input
  segmentedInputOptions?: ISegmentedInputOption[];
}

export interface IDynamicFormSelectControl extends IDynamicFormBaseControl {
  type: 'select';
  // options for select controls
  options?: ILabeledValue[];
  placeholder?: string;
  dictCode?: number;
  parentCode?: number;
  lookupKey?: ILookupKey;
}

export interface IDynamicFormMultiSelectControl extends IDynamicFormBaseControl {
  type: 'multiselect';
  // options for select controls
  options?: ILabeledValue[];
  placeholder?: string;
  dictCode?: number;
  parentCode?: number;
  lookupKey?: ILookupKey;
}

export interface IDynamicFormTextControl extends IDynamicFormBaseControl {
  type: 'text' | 'password' | 'checkbox' | 'colorpicker';
  placeholder?: string;
  autofocus?: boolean;
}

export interface IDynamicFormTextareaControl extends IDynamicFormBaseControl {
  type: 'textarea' | 'htmltextarea';
  // number of rows for textarea, defaults to 2
  rows?: number;
  placeholder?: string;
  height?: string;
}

export interface IDynamicFormDebtAmountControl extends IDynamicFormBaseControl {
  total: number;
  placeholder?: string;
  type: 'debt-amount';
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
  disabled?: boolean;
  display?: boolean;
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
  // optionsActions?: Array<ISelectionAction>;
  optionsRenderer?: (label: string, item: ILabeledValue) => string;
  // options for multilanguage
  langConfig?: IMultiLanguageConfig[];
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
  gridColumns?: ISimpleGridColumn<any>[];
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
  // options for debt amount control
  amount?: number;
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
  | 'datetimepicker'
  | 'timepicker'
  | 'debt-amount'
  | 'dialog'
  | 'dialogmultiselect'
  | 'file'
  | 'gridselect'
  | 'htmltextarea'
  | 'image'
  | 'multilanguage'
  | 'multiselect'
  | 'number'
  | 'password'
  | 'radio'
  | 'searchBtn'
  | 'segmented'
  | 'select'
  | 'text'
  | 'textarea'
  | 'texteditor'
  | 'scripteditor'
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
