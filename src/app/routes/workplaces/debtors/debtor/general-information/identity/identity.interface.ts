export interface IIdentityDoc {
  docTypeCode: number;
  docNumber: string;
  issueDate?: Date;
  issuePlace?: string;
  expiryDate?: Date;
  nationality?: string;
  isMain: boolean;
  comment?: string;
}
