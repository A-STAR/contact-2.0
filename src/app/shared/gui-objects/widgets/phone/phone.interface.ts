// See: http://confluence.luxbase.int:8090/display/WEB20/Phones
export interface IPhone {
  comment: string;
  id: number;
  inactiveDateTime: Date | string;
  inactiveReasonCode: number;
  isInactive: boolean | number;
  phone: string;
  phoneInternational: string;
  statusCode: number;
  stopAutoInfo: number;
  stopAutoSms: number;
  typeCode: number;
}

export interface ISMSSchedule {
  senderCode: number;
  startDateTime: Date;
  templateId?: number;
  text?: string;
}
