import { IContactPerson } from '../contact/contact-grid.interface';

export interface IPhone {
  typeCode: number;
  phone: string;
  stopAutoSms: number;
  stopAutoInfo: number;
  comment: string;
  person: Partial<IContactPerson>;
}
