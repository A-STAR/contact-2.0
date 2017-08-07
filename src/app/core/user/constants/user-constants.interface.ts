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
