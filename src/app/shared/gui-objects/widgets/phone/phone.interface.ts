// See: http://confluence.luxbase.int:8090/display/WEB20/Phones
export interface IPhone {
  id: number;
  phone: string;
  phoneInternational: string;
  typeCode: number;
  statusCode: number;
  isBlocked: boolean | number;
  blockReasonCode: number;
  blockDateTime: Date | string;
  stopAutoSms: number;
  stopAutoInfo: number;
  comment: string;
}

export interface IPhonesResponse {
  success: boolean;
  phones: Array<IPhone>;
}

export interface ISMSSchedule {
  senderCode: number;
  startDateTime: Date;
  text: string;
}
