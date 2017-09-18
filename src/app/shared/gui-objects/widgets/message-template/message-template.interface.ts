export interface IMessageTemplate {
  id: number;
  name: string;
  text: string;
  typeCode: number;
  isSingleSending: number;
  recipientTypeCode: number;
}

export interface IMessageTemplatesResponse {
  success: boolean;
  templates: IMessageTemplate[];
}

export interface IMessageTemplatesAttributesResponse {
  success: boolean;
  attributes: any[];
}
