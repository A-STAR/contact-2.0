export type TConstantValue = string | number | boolean;

export interface IConstant {
  id: number;
  name: string;
  dsc: string;
  typeCode: number;
  valueB: boolean;
  valueD: string;
  valueN: number;
  valueS: string;
  value?: any;
}

export interface IConstantsState {
  constants: Array<IConstant>;
  currentConstant: IConstant;
}

export type IConstantActionType =
  'CONSTANT_FETCH' |
  'CONSTANT_FETCH_SUCCESS' |
  'CONSTANT_UPDATE';

export interface IConstantAction {
  type: IConstantActionType;
  payload?: any;
}
