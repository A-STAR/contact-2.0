import { Observable } from 'rxjs/Observable';

import { IMetadataAction } from '@app/core/metadata/metadata.interface';

export interface IInfoDebtEntry {
  debtId: number;
  personId: number;
  personFirstName: string;
  personLastName: string;
  personMiddleName: string;
  personFullName: string;
  personTypeCode: number;
  personRole: number;
  contract: string;
  dpd: number;
  creditTypeCode: number;
  creditName: string;
  bankName: string;
  portfolioId: number;
  portfolioName: string;
  statusCode: number;
  personStageCode: number;
  stageCode: number;
  reasonCode: number;
  debtAmount: number;
  totalAmount: number;
  currencyName: string;
  branchCode: number;
  regionCode: number;
  dictValue1: number;
  dictValue2: number;
  dictValue3: number;
  dictValue4: number;
  comment: string;
  statusReasonCode: number;
  lastCall: Date;
  lastVisit: Date;
  resultLastCall: string;
  resultLastVisit: string;
  userId: number;
  userFullName: string;
  assignmentDate: Date;
  nextCallDate: Date;
  color: string;
}

export interface IInfoDebtSMS {
  smsId: number;
  phone: string;
  statusCode: number;
  startDateTime: string | Date;
  sendDateTime: string | Date;
  userFullName: string;
  text: string;
  templateName: string;
}

export interface IInfoDebtEmail {
  emailId: number;
  email: string;
  statusCode: number;
  startDateTime: string | Date;
  sendDateTime: string | Date;
  userFullName: string;
  subject: string;
  templateName: string;
}

export interface IGridDef {
  isInitialised: boolean;
  gridKey$: Observable<string>;
  rowIdKey?: string;
  title: string;
  actions?: IMetadataAction[];
  columns?: IGridColumn[];
  permission?: Observable<boolean>;
}

export interface IGridColumn {
  dataType: number;
  name: string;
  label: string;
  dictCode?: number;
}

export interface ILetterExport {
  url: string;
  name: string;
}
