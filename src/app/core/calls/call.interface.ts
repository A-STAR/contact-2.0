export interface ICallSettings {
  useIntPhone?: number;
  usePreview?: number;
  previewShowRegContact?: number;
  useMakeCall?: number;
  useDropCall?: number;
  useHoldCall?: number;
  useRetrieveCall?: number;
  useTransferCall?: number;
  useAgentStatus?: number;
}

export interface ICall {
  phoneId: number;
  debtId: number;
  personId: number;
  personRole: number;
  phone: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface ICallState {
  pbxConnected: boolean;
  pbxState: IPBXState;
  settings: ICallSettings;
  params: IPBXParams;
  activeCall: ICall;
}

export interface IPBXParams {
  intPhone: string;
}

export enum PBXStateEnum {
  PBX_BLOCK = 'block',
  PBX_NOCALL = 'noCall',
  PBX_CALL = 'call',
  PBX_HOLD = 'hold',
  PBX_DIAL = 'dial'
}

export interface IPBXStatePayload {
  phoneId?: number;
  debtId?: number;
  personRole?: number;
  personId?: number;
  contractId?: number;
  callTypeCode?: number;
  afterCallPeriod?: number;
}

export interface IPBXState {
  lineStatus: PBXStateEnum;
  userStatus?: number;
  date: string;
  username?: string;
  payload?: IPBXStatePayload;
}

export enum CallTypeEnum {
  INCOMING = 0,
  OUTGOING = 1
}
