export interface IMessageTemplate {
  id: number;
  name: string;
  text: string;
  typeCode: number;
  isSingleSending?: number;
  recipientTypeCode?: number;
  formatCode?: number;
}
