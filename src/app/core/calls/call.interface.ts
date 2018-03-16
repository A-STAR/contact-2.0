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

export interface IPBXState {
  lineStatus: PBXStateEnum;
  userStatus: number;
}
