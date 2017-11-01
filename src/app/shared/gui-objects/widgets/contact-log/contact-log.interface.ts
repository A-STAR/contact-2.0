export interface IContactLog {
  id?: number;
  comment?: string;
  contactDateTime?: Date | string;
  contactData?: any;
  contactNumber?: string;
  contactPhone?: string;
  contactType?: number;
  createDateTime?: Date | string;
  creditName?: string;
  dedbId?: number;
  fullName?: string;
  personRole?: number;
  promiseAmount?: number;
  promiseDate?: Date | string;
  resultName?: string;
  sentDateTime?: Date | string;
  startDateTime?: Date | string;
  status?: string;
  text?: string;
  userFullName?: string;
}
