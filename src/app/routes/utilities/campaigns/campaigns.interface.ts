export interface ICampaign {
  id: number;
  name: string;
  groupName: any;
  statusCode: number;
  typeCode: number;
  startDateTime: number;
  finishDateTime: number;
  comment: string;
  timeZoneUsed: boolean;
}

export enum CampaignsDialogActionEnum {
  NONE,
  CAMPAIGN_ADD,
  CAMPAIGN_EDIT,
  CAMPAIGN_REMOVE,
  PARTICIPANT_ADD,
  PARTICIPANT_EDIT,
  PARTICIPANT_REMOVE
}
