// See: http://confluence.luxbase.int:8090/display/WEB20/Emails
export interface IEmail {
  id: number;
  typeCode: number;
  email: string;
  isBlocked: boolean | number;
  blockReasonCode: number;
  blockDateTime: Date | string;
  comment: string;
}

export interface IEmailsResponse {
  success: boolean;
  emails: Array<IEmail>;
}
