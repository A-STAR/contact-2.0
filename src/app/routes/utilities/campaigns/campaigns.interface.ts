export enum CampaignStatus {
  NONE,
  CREATED,
  STARTED,
  STOPPED,
  COMPLETED
}

export interface ICampaignGroup {
  id:	number;
  name:	string;
  entityTypeId: number;
  isManual: number;
  comment: string;
}

export interface ICampaign {
  id: number;
  name?: string;
  multiName?: {
    value: string;
    languageId: number;
  }[];
  groupId?: number;
  groupName?: string;
  statusCode?: CampaignStatus;
  typeCode?: number;
  startDateTime?: string;
  finishDateTime?: string;
  comment?: string;
  timeZoneUsed?: boolean;
}

export interface ICampaignsStatistic {
  userStatistic: IUserStatistic[];
  aggregatedData: ICampaignAggregatedStatistic;
}

export interface ICampaignAggregatedStatistic {
  untreated: number;
  successProcessingSum: number;
  unsuccessProcessingSum: number;
  contacSum: number;
  SMSSum: number;
  refusalSum: number;
  promiseSum: number;
  promiseAmountSum: number;
}

export interface IUserStatistic {
  userFullName: string;
  successProcessing: number;
  unsuccessProcessing: number;
  contact: number;
  SMS: string;
  successContact: number;
  refusal: number;
  promise: number;
  promiseAmount: number;
}


export interface ICampaignSelectPayload {
  selectedCampaign: ICampaign;
}

export interface IParticipant {
  id: number;
  fullName: string;
  // ??
  organization: string;
  // ??
  position: string;
}

export interface IParticipantSelectPayload {
  selectedParticipant: IParticipant;
}

export type ICampaignsState = ICampaignSelectPayload & IParticipantSelectPayload;

