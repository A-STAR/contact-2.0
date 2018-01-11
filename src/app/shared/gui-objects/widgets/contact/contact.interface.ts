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
  linkTypeCode?: number;
  comment?: string;
}
