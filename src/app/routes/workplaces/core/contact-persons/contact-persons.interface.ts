export interface IContactPerson {
  birthDate: string;
  birthPlace: string;
  comment: string;
  /**
   * Linked person ID
   */
  contactId: number;
  /**
   * Link ID in pivot table
   */
  contactPersonId: number;
  educationCode: number;
  familyStatusCode: number;
  firstName: string;
  fullName: string;
  genderCode: number;
  lastName: string;
  linkTypeCode: number;
  middleName: string;
  stageCode: number;
  stringValue10: string;
  stringValue1: string;
  stringValue2: string;
  stringValue3: string;
  stringValue4: string;
  stringValue5: string;
  stringValue6: string;
  stringValue7: string;
  stringValue8: string;
  stringValue9: string;
  typeCode: number;
}

export interface IContactLink {
  contactId: number;
  linkTypeCode: number;
}
