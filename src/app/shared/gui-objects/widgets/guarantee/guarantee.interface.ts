export interface IGuarantor {
  id?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  birthDate?: Date | string;
  birthPlace?: string;
  genderCode?: number;
  familyStatusCodeCode?: number;
  educationCode?: number;
  comment?: string;
  typeCode?: number;
  stringValue1?: string;
  stringValue2?: string;
  stringValue3?: string;
  stringValue4?: string;
  stringValue5?: string;
  stringValue6?: string;
  stringValue7?: string;
  stringValue8?: string;
  stringValue9?: string;
  stringValue10?: string;
}

export interface IGuaranteeContract {
  id?: number;
  contractId?: number;
  contractNumber?: string;
  contractDate?: Date | string;
  contractEndDate?: Date | string;
  contractTypeCode?: number;
  comment?: string;
  personId?: number;
}

export interface IEmployment {
  id?: number;
  workTypeCode: number;
  company?: string;
  position?: string;
  hireDate?: Date | string;
  dismissDate?: Date | string;
  income?: number;
  currencyId?: number;
  comment?: string;
}
