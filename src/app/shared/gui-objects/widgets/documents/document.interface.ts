export interface IDocument {
  id: number;
  docName: string;
  docTypeCode: number;
  docNumber: string;
  userId: number;
  comment: string;
  lastName: string;
  firstName: string;
  middleName: string;
  fileName: string;
  entityTypeCode: number;
  isBlocked: number | boolean;
}

export interface IDocumentsResponse {
  success: boolean;
  documents: Array<IDocument>;
}
