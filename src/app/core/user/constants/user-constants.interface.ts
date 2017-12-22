export interface IUserConstant {
  id: number;
  name: string;
  valueB: boolean;
  valueD: string;
  valueN: number;
  valueS: string;
}

export interface IUserConstants {
  [key: string]: IUserConstant;
}

export interface IUserConstantsState {
  constants: IUserConstants;
}
