import { IIdentityDoc } from './general-information/identity/identity.interface';

export interface IDebtorGeneralInformationResponse {
  success: boolean;
  data: IDebtorGeneralInformation;
}

export interface IDebtorGeneralInformationPhonesPayload {
  id: number;
  data: IDebtorGeneralInformationPhone[];
}

export interface IIdentityPayload {
  id: number;
  identityDocs: IIdentityDoc[];
}

export interface IDebtorGeneralInformationPhonesResponse {
  success: boolean;
  data: IDebtorGeneralInformationPhonesPayload;
}

export interface IDebtorFetchResponse {
  success: boolean;
  debtor: IDebtor;
}

export interface IDebtorGeneralInformationPhone {
  active: number;
  blockingDate?: Date;
  blockingReason?: string;
  contactPerson?: string;
  comment: string;
  lastCall?: string;
  number: string;
  numberExists: number;
  region?: string;
  qualityCode?: string;
  qualityCodeByDataQ?: string;
  verified: number;
  status: number;
  type: number;
}

export interface IDebtorGeneralInformation {
  id: number;
  birthDate: string;
  company: string;
  position?: string;
  income?: number;
  citizenship?: string;
  sex: number;
  workplaceChecked: number;
  importance: number;
  stage: number;
  decency: number;
  maritalStatus?: number;
  education?: number;
  email?: string;
  series: string;
  number: string;
  issueDate: string;
  issuedBy: string;
  birthPlace?: string;
  phones?: IDebtorGeneralInformationPhone[];
}

export interface IDebtor {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  generalInformation?: IDebtorGeneralInformation;
  identityDocs?: IIdentityDoc[];
  product: string;
  responsible: string;
  reward: number;
  type: number;
}

