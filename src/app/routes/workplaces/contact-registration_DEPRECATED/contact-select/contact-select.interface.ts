export interface ILinkedContactPerson {
  id: number;
  linkTypeCode: number;
  personFullName: string;
  personId: number;
  personRole: number;
}

export interface IContactPerson {
  birthDate: string;
  firstName: string;
  genderCode: number;
  id: number;
  lastName: string;
  middleName: string;
  passportNumber: string;
  stringValue1: string;
  stringValue2: string;
  stringValue3: string;
  stringValue4: string;
  stringValue5: string;
  stringValue6: string;
  stringValue7: string;
  stringValue8: string;
  stringValue9: string;
  stringValue10: string;
  typeCode: number;
}

export interface INewContactPerson {
  lastName: string;
  firstName: string;
  middleName: string;
  personTypeCode: number;
  linkTypeCode: number;
}

export interface IContactPersonRequest {
  personId: number;
  linkTypeCode?: number;
}

export type IContactPayload = IContactPersonRequest | INewContactPerson;
