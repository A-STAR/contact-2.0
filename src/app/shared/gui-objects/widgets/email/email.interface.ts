// See: http://confluence.luxbase.int:8090/display/WEB20/Emails
export interface IEmail {
  comment: string;
  email: string;
  id: number;
  inactiveDateTime: Date | string;
  inactiveReasonCode: number;
  isInactive: boolean | number;
  typeCode: number;
}

export interface IEmailSchedule {
  senderCode: number;
  startDateTime: Date;
  subject: string;
  templateId?: number;
  text?: string;
}
