export interface IUserConstant {
  id: number;
  name: string;
  valueB: boolean;
  valueD: string;
  valueN: number;
  valueS: string;
}

export interface IUserConstantsState {
  constants: Array<IUserConstant>;
}
