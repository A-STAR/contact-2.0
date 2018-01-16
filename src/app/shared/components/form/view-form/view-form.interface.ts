export interface IViewFormData {
  [key: string]: boolean | number | string | Date;
}

export type IViewFormControlType = 'text' | 'dict';

export interface IViewFormBasicControl {
  label: string;
  name: string;
  type: IViewFormControlType;
  width?: number;
}

export interface IViewFormGroup {
  children: Array<IViewFormGroup | IViewFormControl>;
  width?: number;
}

export interface IViewFormDictControl extends IViewFormBasicControl {
  dictCode: number;
  type: 'dict';
}

export interface IViewFormTextControl extends IViewFormBasicControl {
  type: 'text';
}

export type IViewFormControl = IViewFormBasicControl | IViewFormDictControl;

export type IViewFormItem = IViewFormControl | IViewFormGroup;
