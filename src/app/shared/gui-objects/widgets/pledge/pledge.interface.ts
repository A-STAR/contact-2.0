export interface IPledgeContract {
  id?: number;
  contractId?: number;
  contractNumber: string;
  contractStartDate?: Date | string;
  contractEndDate?: Date | string;
  comment?: string;
  personId?: number;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  fullName?: string;
  typeCode?: number;
  birthDate?: Date | string;
  birthPlace?: string;
  genderCode?: number;
  familyStatusCode?: number;
  educationCode?: number;
  personComment?: string;
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
  propertyId?: number;
  propertName?: string;
  propertyType?: number;
  propertyComment?: string;
  pledgeValue?: number;
  marketValue?: number;
  currencyId?: number;
}

export interface IContractInformation {
  contractNumber: string;
  contractStartDate?: Date | string;
  contractEndDate?: Date | string;
  comment?: string;
}

export interface IPledgeContractInformation extends IContractInformation {
  pledgors: IContractPledgor[];
}

export interface IContractPledgor {
  personId?: number;
  properties?: IContractProperty[];
}

export interface IContractProperty {
  propertyId?: number;
  pledgeValue?: number;
  marketValue?: number;
  currencyId?: number;
}
