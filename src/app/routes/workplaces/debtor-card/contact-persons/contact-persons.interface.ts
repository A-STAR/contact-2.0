export interface IContact {
  id?: number;
  fullName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  birthDate?: Date | string;
  birthPlace?: string;
  genderCode?: number;
  familyStatusCode?: number;
  educationCode?: number;
  comment?: string;
}

export interface IContactLink {
  contactPersonId: number;
  linkTypeCode?: number;
}
