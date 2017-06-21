export interface IUserConstant {
  id: number;
  name: string;
  valueB: boolean;
  valueD: string;
  valueN: number;
  valueS: string;
}

export interface IUserConstantsResponse {
  success: boolean;
  data: Array<IUserConstant>;
}

export interface IUserConstantsState {
  constants: Array<IUserConstant>;
}

export type IUserConstantActionType = 'USER_CONSTANTS_FETCH' | 'USER_CONSTANTS_FETCH_SUCCESS';

export interface IUserConstantFetchSuccessPayload {
  data: Array<IUserConstant>;
}

export interface IUserConstantAction {
  type: IUserConstantActionType;
  payload?: IUserConstantFetchSuccessPayload;
}
