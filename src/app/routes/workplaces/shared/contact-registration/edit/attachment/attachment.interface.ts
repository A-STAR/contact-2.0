export interface IAttachment {
  comment: string;
  docName: string;
  docNumber: string;
  docTypeCode: number;
  fileName: string;
  guid: string;
}

export interface IAttachmentFormData {
  comment: string;
  docName: string;
  docNumber: string;
  docTypeCode: number;
  file: File;
  fileName: string;
}
