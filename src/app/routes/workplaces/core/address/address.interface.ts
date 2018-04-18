// See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=93585480#id-Адреса-Добавление
export interface IAddress {
  id: number;
  typeCode: number;
  postalCode: string;
  statusCode: number;
  isInactive: boolean | number;
  inactiveReasonCode: number;
  inactiveDateTime: Date | string;
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
  isText: boolean | number;
  isResidence: boolean | number;
  comment: string;
  latitude?: number;
  longitude?: number;
}

export interface IAddressMarkData {
  purposeCode: number;
  comment: string;
  debtIds: number[];
  personRole: number;
}
