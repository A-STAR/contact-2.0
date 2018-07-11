export interface IProperty {
  id?: number;
  name?: string;
  typeCode: number;
  isConfirmed?: number;
  comment?: string;
}

export interface IPledgeContractProperty {
  propertyId: number;
  propertyName: string;
  propertyType: number;
  propertyComment: string;
  pledgeValue: number;
  marketValue: number;
  currencyId: number;
}
