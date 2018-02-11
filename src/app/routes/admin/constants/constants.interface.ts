export type TConstantValue = string | number | boolean;

export interface IConstant {
  id: number;
  name: string;
  dsc: string;
  typeCode: number;
  valueB: number;
  valueD: string;
  valueN: number;
  valueS: string;
  value?: any;
}

export interface IConstantsState {
  currentConstant: IConstant;
}

export type IConstantActionType = 'CONSTANT_UPDATE';

export interface IConstantAction {
  type: IConstantActionType;
  payload?: any;
}
