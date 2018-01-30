export interface IGroupDebt {
  id: number;
  groupId?: number;
  debtId: number;
  personId: number;
  personFullName: string;
  bankName: string;
  portfolioName: string;
  contract: string;
  creditName: string;
  currencyName: string;
  debtAmount: number;
  totalAmount: number;
  dpd: number;
  userFullName: string;
  statusCode: number;
  dict1Value: number;
  dict2Value: number;
  dict3Value: number;
  dict4Value: number;
}

