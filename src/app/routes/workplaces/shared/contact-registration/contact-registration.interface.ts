export enum IContactRegistrationMode {
  TREE,
  EDIT,
}

export interface IOutcome {
  fileAttachMode: number;
  id: number;
  paymentMode: number;
  promiseMode: number;
}
