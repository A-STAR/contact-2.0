export enum CampaignsDialogActionEnum {
  NONE,
  CAMPAIGN_ADD,
  CAMPAIGN_EDIT,
  CAMPAIGN_REMOVE,
  PARTICIPANT_ADD,
  PARTICIPANT_REMOVE
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
  name: string;
  multiname?: {
    value: string;
    languageId: number;
  };
  groupId: number;
  groupName: string;
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

