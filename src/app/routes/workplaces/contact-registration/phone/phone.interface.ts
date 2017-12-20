import { IContactPayload } from '../contact-select/contact-select.interface';

export interface IPhone {
  typeCode: number;
  phone: string;
  stopAutoSms: number;
  stopAutoInfo: number;
  comment: string;
  person: IContactPayload;
}
