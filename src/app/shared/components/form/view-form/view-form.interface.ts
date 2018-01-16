export interface IViewFormData {
  [key: string]: boolean | number | string | Date;
}

export type IViewFormControlType = 'text' | 'dict' | 'date';

export interface IViewFormBasicControl {
  label: string;
  controlName: string;
  type: IViewFormControlType;
  width?: number;
}

export interface IViewFormGroup {
  children: Array<IViewFormGroup | IViewFormControl>;
  width?: number;
}

export interface IViewFormDateControl extends IViewFormBasicControl {
  type: 'date';
}

export interface IViewFormDictControl extends IViewFormBasicControl {
  dictCode: number;
  type: 'dict';
}

export interface IViewFormTextControl extends IViewFormBasicControl {
  type: 'text';
}

export type IViewFormControl = IViewFormDateControl | IViewFormDictControl | IViewFormTextControl;

export type IViewFormItem = IViewFormControl | IViewFormGroup;
