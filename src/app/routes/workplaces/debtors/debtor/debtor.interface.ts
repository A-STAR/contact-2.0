export interface IDebtorGeneralInformationResponse {
  success: boolean;
  data: IDebtorGeneralInformation;
}

export interface IDebtorGeneralInformationPhonesPayload {
  id: number;
  data: IDebtorGeneralInformationPhone[];
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
  type: number;
  number: string;
  status: number;
  lastCall?: string;
  contactPerson?: string;
  comment: string;
  region?: string;
  active: number;
  qualityCode?: string;
  numberExists: number;
  qualityCodeByDataQ?: string;
  verified: number;
  blockingDate?: Date;
  blockingReason?: string;
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
  type: number;
  responsible: string;
  reward: number;
  product: string;
  generalInformation: IDebtorGeneralInformation;
}
