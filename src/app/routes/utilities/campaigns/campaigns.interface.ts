export enum CampaignsDialogActionEnum {
  NONE,
  CAMPAIGN_ADD,
  CAMPAIGN_EDIT,
  CAMPAIGN_REMOVE,
  PARTICIPANT_ADD,
  PARTICIPANT_EDIT,
  PARTICIPANT_REMOVE
}

export interface ICampaign {
  id: number;
  name: string;
  groupName: any;
  statusCode: number;
  typeCode: number;
  startDateTime: string;
  finishDateTime: string;
  comment: string;
  timeZoneUsed: boolean;
}

export interface ICampaignsStatistic {
  userStatistic: IUserStatistic[];
  agridatedData: ICampainAgrigatedStatistic;
}

export interface ICampainAgrigatedStatistic {
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
  SMS: number;
  successContact: number;
  refusal: number;
  promise: number;
  promiseAmount: number;
}


export interface ICampaignSelectPayload {
  selectedCampaign: ICampaign;
}

export interface IParticipant {
  id?: number;
  userId: number;
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

