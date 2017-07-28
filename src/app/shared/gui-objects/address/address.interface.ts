// See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=93585480#id-Адреса-Добавление
export interface IAddress {
  id: number;
  typeCode: number;
  postalCode: string;
  statusCode: number;
  isBlocked: boolean;
  blockReasonCode: number;
  blockDateTime: Date | string;
  fullAddress: string;
  country: string;
  region: string;
  area: string;
  city: string;
  settlement: string;
  cityDistrict: string;
  street: string;
  house: string;
  building: string;
  flat: string;
  isText: boolean;
  isResidence: boolean;
  comment: string;
}

export interface IAddressesResponse {
  success: boolean;
  addresses: Array<IAddress>;
}
