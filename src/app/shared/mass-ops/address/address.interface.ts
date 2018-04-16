import { IContact } from '@app/shared/mass-ops/contact-log/contact-log.interface';

interface IAddressResponce {
  id: number;
  personId: number;
  personFullName: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export interface IAddressByPerson extends IAddressResponce {
  typeCode: number;
  statusCode: number;
  isInactive: number;
}

export interface IAddressByContact extends IAddressResponce, IContact {
  contactLatitude: number;
  contactLongitude: number;
  accuracy: number;
  addressTypeCode: number;
  distance: number;
  comment: string;
  userId: number;
  typeCode?: number;
  isInactive?: boolean;
}

export interface IAddressData<T> {
  entityType: 'person' | 'contact';
  data: T[];
}

