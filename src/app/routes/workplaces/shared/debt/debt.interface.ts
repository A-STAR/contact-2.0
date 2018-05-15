export interface IAddressOrPhone {
  id: number;
  isInactive: boolean | number;
}

export interface IDebtNextCall {
  forAllDebts: number;
  nextCallDateTime: string;
}
