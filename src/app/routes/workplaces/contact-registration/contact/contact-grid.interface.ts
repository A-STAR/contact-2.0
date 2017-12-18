export interface IContactPerson {
  linkTypeCode: number;
  personFullName: string;
  personRole: number;
}

export interface IContactPersonFormData {
  firstName: string;
  lastName: string;
  linkTypeCode: number;
  middleName: string;
}
