export interface IContactLogEntry {
  bankName: string;
  branchCode: number;
  contactId: number;
  contactPersonFullName: string;
  contactPersonRole: number;
  contactType: number;
  contract: string;
  coverAmount: number;
  creditEndDate: string;
  creditName: string;
  creditStartDate: string;
  creditTypeCode: number;
  currencyName: string;
  debtAmount: number;
  debtId: number;
  debtStatusCode: number;
  dictValue1: number;
  dictValue2: number;
  dictValue3: number;
  dictValue4: number;
  dpd: number;
  organization: string;
  outPortfolioId: number;
  outportfolioname: string;
  personFirstName: string;
  personFullName: string;
  personId: number;
  personLastName: string;
  personMiddleName: string;
  personTypeCode: number;
  portfolioId: number;
  portfolioName: string;
  promiseAmount: number;
  promiseDate: string;
  promiseId: number;
  receiveDateTime: string;
  regionCode: number;
  responsibleUserFullName: string;
  startDate: string;
  statusCode: number;
  timeZone: string;
  userFullName: string;
  userId: number;
}

export enum ContactsGridKeys {
  PROMISE = 'contactLogPromise',
  SMS = 'contactLogSMS',
  CONTACT = 'contactLogContact',
  EMAIL = 'contactLogEmail'
}
