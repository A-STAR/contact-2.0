import { IContactTreeAttribute } from '@app/routes/utilities/contact-properties/contact-properties.interface';

export enum IContactRegistrationStatus {
  REGISTRATION = 1,
  PAUSE,
}

export interface IContactRegistrationParams {
  campaignId: number;
  contactId: number;
  contactType: number;
  debtId: number;
  personId: number;
  personRole: number;
}

export enum IContactRegistrationMode {
  TREE,
  EDIT,
}

export interface IOutcome {
  addPhone: number;
  attributes?: IContactTreeAttribute[];
  autoCommentIds: string;
  boxColor: string;
  callReasonMode: number;
  changeContactPerson: number;
  changeResponsible: number;
  // children: IContactTreeNode[];
  code: number;
  commentMode: number;
  contactInvisible: number;
  debtReasonMode: number;
  debtStatusCode: number;
  dictValue1: number;
  dictValue2: number;
  dictValue3: number;
  dictValue4: number;
  fileAttachMode: number;
  id: number;
  isInvalidContact: number;
  isRefusal: number;
  isSuccess: number;
  name: string;
  nextCallDays: number;
  nextCallFormula: number;
  nextCallMode: number;
  paymentMode: number;
  promiseMode: number;
  regInvisible: number;
  sortOrder: number;
  statusReasonMode: number;
  templateFormula: number;
  templateId: number;
}

export interface IContactRegistrationData {
  code: number;
}

// tslint:disable:no-bitwise
export enum CompleteStatus {
  None       = 0,
  Payment    = 1 << 0,
  Promise    = 1 << 1,
  Address    = 1 << 2,
  Phone      = 1 << 3,
  Attachment = 1 << 4,
}
// tslint:enable:no-bitwise
