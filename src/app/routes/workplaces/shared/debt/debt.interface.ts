export interface IContactRegistrationParams {
  campaignId: number;
  contactId: number;
  contactType: number;
  debtId: number;
  personId: number;
  personRole: number;
}

export interface IContact {
  isInactive: boolean | number;
}

export interface IAddress extends IContact {
  id: number;
}

export interface IPhone extends IContact {
  id: number;
}

export interface IDebt {
  bankId: number;
  branchCode: number;
  comment: string;
  contract: string;
  creditEndDate: Date | string;
  creditName: string;
  creditStartDate: Date | string;
  creditTypeCode: number;
  currencyId: number;
  debtAmount: number;
  debtReasonCode: number;
  dict1Code: number;
  dict2Code: number;
  dict3Code: number;
  dict4Code: number;
  dpd: number;
  id: number;
  personId: number;
  portfolioId: number;
  regionCode: number;
  responsibleId: number;
  startDate: Date | string;
  statusCode: number;
  totalAmount: number;
  utc: string;
}

export interface IDebtNextCall {
  forAllDebts: number;
  nextCallDateTime: string;
}

export interface IDebtOpenIncomingCallData {
  debtId: number[];
}
