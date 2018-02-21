export interface IIdentityDoc {
  id?: number;
  citizenship?: string;
  comment?: string;
  docNumber: string;
  docTypeCode: number;
  expiryDate?: Date | string;
  issueDate?: Date | string;
  issuePlace?: string;
  isMain: number;
  refPersonId?: number;
}
