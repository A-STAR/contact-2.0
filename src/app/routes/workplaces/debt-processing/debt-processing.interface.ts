export interface IDebt {
  debtId: number;
  personId: number;
  personFullName: string;
  personTypeCode: number;
  personBirthDate: Date | string;
  creditTypeCode: number;
  creditName: string;
  portfolioName: string;
  bankName: string;
  contract: string;
  statusCode: number;
  regionCode: number;
  branchCode: number;
  startDate: Date | string;
  dpd: number;
  debtAmount: number;
  totalAmount: number;
  currency: string;
  creditStartDate: Date | string;
  creditEndDate: Date | string;
}

export interface IDebtProcessingState {
  data: Array<IDebt>;
  total: number;
}
