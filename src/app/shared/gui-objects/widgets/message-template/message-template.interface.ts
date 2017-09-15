import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form.interface';

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
