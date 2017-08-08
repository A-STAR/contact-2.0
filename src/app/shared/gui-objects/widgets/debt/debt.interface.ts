export interface IDebt {
  id: number;
  portfolioId: number;
  bankId: number;
  creditTypeCode: number;
  creditName: string;
  contract: string;
  statusCode: number;
  debtReasonCode: number;
  creditStartDate: Date | string;
  creditEndDate: Date | string;
  currencyId: number;
  debtSum: number;
  totalSum: number;
  dpd: number;
  startDate: Date | string;
  regionCode: number;
  branchCode: number;
  utc: string;
  comment: string;
  responsibleId: number;
  dict1Code: number;
  dict2Code: number;
  dict3Code: number;
  dict4Code: number;
}

export interface IDebtsResponse {
  success: boolean;
  debts: Array<IDebt>;
}
