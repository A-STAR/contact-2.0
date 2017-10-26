export interface IAddressMarkData {
  purposeCode: number;
  comment: string;
  debtIds: number[];
}

export interface IDebt {
  id: number;
  contract: string;
  statusCode: number;
  currencyName: string;
  debtAmount: number;
}
