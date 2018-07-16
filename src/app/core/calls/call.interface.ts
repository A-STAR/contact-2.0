export interface ICallSettings {
  previewShowRegContact?: number;
  useAgentStatus?: number;
  useDropCall?: number;
  useHoldCall?: number;
  useIntPhone?: number;
  useMakeCall?: number;
  usePredictive?: number;
  usePreview?: number;
  useRetrieveCall?: number;
  useTransferCall?: number;
  callResultUseIntermediateCodeMode?: UseIntermediateStatusEnum;
}

export enum UseIntermediateStatusEnum {
  FINAL_RESULT_ONLY = 0,
  LAST_NODE_ONLY = 1,
  ALL_NODE = 2
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
  pbxCallId?: number;
  phoneId?: number;
  debtId?: number;
  personRole?: number;
  personId?: number;
  contractId?: number;
  callTypeCode?: number;
  afterCallPeriod?: number;
  phoneNumber?: string;
}

export interface IPBXState {
  lineStatus: PBXStateEnum;
  userStatus: number;
  payload: IPBXStatePayload;
  // date: string;
  // username?: string;
}

export enum CallTypeEnum {
  INCOMING = 0,
  OUTGOING = 1
}
