// See: http://confluence.luxbase.int:8090/display/WEB20/Phones
export interface IPhone {
  id: number;
  phone: string;
  phoneInternational: string;
  typeCode: number;
  statusCode: number;
  isInactive: boolean | number;
  inactiveReasonCode: number;
  inactiveDateTime: Date | string;
  stopAutoSms: number;
  stopAutoInfo: number;
  comment: string;
}

export interface ISMSSchedule {
  templateId?: number;
  senderCode: number;
  startDateTime: Date;
  text?: string;
}
