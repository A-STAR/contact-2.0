import { FormControl, ValidatorFn } from '@angular/forms';

import { IDialogMultiSelectFilterType } from '../dialog-multi-select/dialog-multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';
import { ILabeledValue } from '../../../../core/converter/value-converter.interface';
import { ILookupKey } from '../../../../core/lookup/lookup.interface';
import {
  IMultiLanguageOption,
  IMultiLanguageConfig
} from '../../../../shared/components/form/multi-language/multi-language.interface';
import { IRadioGroupOption } from '../radio-group/radio-group.interface';
import { ISegmentedInputOption } from '../segmented-input/segmented-input.interface';
import { ISelectionAction } from '../select/select.interface';

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

export interface IDynamicFormConfig {
  suppressLabelCreation?: boolean;
  labelKey?: string;
}

export interface IDynamicFormControl {
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
  type: TControlTypes;
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
  // options for debt amount control
  amount?: number;
}

// TODO(d.maltsev): extend from base control when it's merged
export interface IDynamicFormDebtAmountControl {
  amount: number;
  controlName: string;
  label?: string;
  required?: boolean;
  type: 'debt-amount';
}

/**
 * To make the control `hidden` set `type` to whatever and `display`="false"
 */
export type TControlTypes =
    'boolean'
  | 'button'
  | 'checkbox'
  | 'colorpicker'
  | 'datepicker'
  | 'debt-amount'
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
