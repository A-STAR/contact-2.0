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

