export interface IDebt {
  bankName: string;
  branchCode: number;
  creditEndDate: Date | string;
  creditName: string;
  creditStartDate: Date | string;
  creditTypeCode: number;
  contract: string;
  currency: string;
  debtAmount: number;
  debtId: number;
  dpd: number;
  personId: number;
  personFullName: string;
  personTypeCode: number;
  personBirthDate: Date | string;
  portfolioName: string;
  regionCode: number;
  responsibleFullName?: string;
  shortInfo?: string;
  startDate: Date | string;
  statusCode: number;
  totalAmount: number;
  utc?: Date | string;
}

