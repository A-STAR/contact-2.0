import { IContact } from '@app/shared/mass-ops/contact-log/contact-log.interface';

interface IAddressResponce {
  id: number;
  personId: number;
  personFullName: string;
  fullAddress: string;
}

export interface IAddressByPerson extends IAddressResponce {
  typeCode: number;
  statusCode: number;
  isInactive: number;
  latitude: number;
  longitude: number;
}

export interface IAddressByContact extends IAddressResponce, IContact {
  contactLatitude: number;
  contactLongitude: number;
  accuracy: number;
  addressTypeCode: number;
  visitStatus?: number;
  distance: number;
  comment: string;
  userId: number;
  typeCode?: number;
  isInactive?: boolean;
  addressLatitude?: number;
  addressLongitude?: number;
  isContact?: boolean;
}

