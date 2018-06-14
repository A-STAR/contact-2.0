import { Observable } from 'rxjs/Observable';

export interface IWorkTaskEntry {
  debtId: number;
  personId: number;
  personFirstName: string;
  personLastName: string;
  personMiddleName: string;
  personFullName: string;
  personTypeCode: number;
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

export interface IGridDef {
  isInitialised: boolean;
  key: string;
  rowIdKey?: string;
  title: string;
  permission?: Observable<boolean>;
}
