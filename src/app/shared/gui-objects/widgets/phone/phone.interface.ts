import { INamedValue } from '../../../../core/converter/value-converter.interface';

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

export interface IPhonesResponse {
  success: boolean;
  phones: Array<IPhone>;
}

export interface ISMSSchedule {
  templateId?: number;
  senderCode: number;
  startDateTime: Date;
  text?: string;
}

export interface IMessageTemplatesResponse {
  success: boolean;
  templates: INamedValue[];
}
