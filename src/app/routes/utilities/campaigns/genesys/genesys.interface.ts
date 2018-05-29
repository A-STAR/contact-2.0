export interface IGenesysCampaign {
  finishDateTime: string;
  groupId: number;
  groupName: string;
  id: number;
  name: string;
  startDateTime: string;
  statusCode: GenesysCampaignStatus;
  typeCode: GenesysCampaignType;
}

export enum GenesysCampaignStatus {
  NOT_LOADED = 1,
  LOADED     = 2,
  STARTED    = 3,
  STOPPED    = 4,
  UNLOADED   = 5,
  CLOSED     = 6,
  UNLOADING  = 7,
}

export enum GenesysCampaignType {
  AUTO_INFO   = 1,
  AUTO_DIALER = 2,
}
