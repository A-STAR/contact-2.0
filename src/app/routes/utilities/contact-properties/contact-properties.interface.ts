export interface IContactTreeAttribute {
  code: number;
  mandatory: number;
  name: string;
  disabledValue: number;
  children: IContactTreeAttribute[];
}

export interface IContactTreeNode {
  addPhone: number;
  attributes: IContactTreeAttribute[];
  autoCommentIds: string;
  boxColor: string;
  callReasonMode: number;
  changeResponsible: number;
  children: IContactTreeNode[];
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
