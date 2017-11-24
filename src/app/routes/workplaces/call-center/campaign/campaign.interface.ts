export interface ICampaignDebt {
  bankName: string;
  birthDate: string | Date;
  branchCode: number;
  contract: string;
  creditEndDate: string | Date;
  creditName: string;
  creditStartDate: string | Date;
  creditTypeCode: number;
  currencyName: string;
  debtAmount: number;
  debtId: number;
  debtComment: string;
  debtReasonCode: number;
  dict1Code: number;
  dict2Code: number;
  dict3Code: number;
  dict4Code: number;
  docNumber: string;
  dpd: number;
  lastCallDateTime: string | Date;
  lastPayDate: string | Date;
  lastPromDate: string | Date;
  lastPromStatusCode: number;
  lastVisitDateTime: string | Date;
  nextCallDateTime: string | Date;
  personComment: string;
  personFirstName: string;
  personFullName: string;
  personId: number;
  personLastName: string;
  personMiddleName: string;
  portfolioName: string;
  regionCode: number;
  shortInfo: string;
  startDate: string | Date;
  statusCode: number;
  totalAmount: number;
}

export interface ICampaignProcessedDebt {
  personFullName: string;
  debtId: number;
  contract: string;
  statusCode: number;
  debtAmount: number;
  currencyName: string;
  dpd: number;
}
