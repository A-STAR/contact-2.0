export interface IPledgeContract {
  id?: number;
  contractNumber: number;
  fullName?: string;
  typeCode?: number;
  contractStartDate?: Date | string;
  contractEndDate?: Date | string;
  comment?: string;
  propertyType: number;
  propertName?: string;
}
