export interface IPerson {
  id: number;
  birthDate?: Date;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  type?: number;
  reward?: number;
  debtId?: number;
  product?: string;
  city?: string;
  typeCode: number;
}
export interface IAddressOrPhone {
  id: number;
  isInactive: boolean | number;
}

export interface IDebtNextCall {
  forAllDebts: number;
  nextCallDateTime: string;
}
