// See: http://confluence.luxbase.int:8090/display/WEB20/Emails
export interface IEmail {
  id: number;
  typeCode: number;
  email: string;
  isInactive: boolean | number;
  inactiveReasonCode: number;
  inactiveDateTime: Date | string;
  comment: string;
}

export interface IEmailsResponse {
  success: boolean;
  emails: Array<IEmail>;
}
