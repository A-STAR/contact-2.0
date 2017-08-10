import { IAGridState } from '../../../shared/components/grid2/grid2.interface';

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
  debtSum: number;
  totalSum: number;
  currency: string;
  creditStartDate: Date | string;
  creditEndDate: Date | string;
}

export interface IDebtProcessingState {
  debts: Array<IDebt>;
  // grid: IAGridState;
}
