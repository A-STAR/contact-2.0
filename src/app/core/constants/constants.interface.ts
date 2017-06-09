export type TConstantValue = string | number | boolean;

export interface IConstant {
  name: string;
  valueB: boolean;
  valueN: number;
  valueS: string;
}

export interface IConstantsResponse {
  success: boolean;
  constants: Array<IConstant>;
}

export interface IConstantsState {
  [key: string]: boolean | string | number;
}

export type IConstantActionType =
  'CONSTANT_FETCH' |
  'CONSTANT_FETCH_SUCCESS' |
  'CONSTANT_UPDATE';

export interface IConstantAction {
  type: IConstantActionType;
  payload?: any;
}
