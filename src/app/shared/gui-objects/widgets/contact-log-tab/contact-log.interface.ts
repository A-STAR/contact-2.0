export interface IContactLog {
  id?: number;
  comment?: string;
  contactDateTime?: Date | string;
  contactData?: any;
  contactNumber?: string;
  contactId?: number;
  contactPhone?: string;
  contactType?: number;
  contract?: number;
  createDateTime?: Date | string;
  creditName?: string;
  debtId?: number;
  fullName?: string;
  personRole?: number;
  promiseAmount?: number;
  promiseDate?: Date | string;
  resultName?: string;
  sentDateTime?: Date | string;
  startDateTime?: Date | string;
  statusCode?: number;
  text?: string;
  userFullName?: string;
  userId?: number;
  formatCode?: number;
}
