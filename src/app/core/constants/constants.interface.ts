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
