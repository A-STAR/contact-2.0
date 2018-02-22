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
  onHold?: boolean;
  isStarted?: boolean;
}

export interface ICallState {
  pbxState: IPBXState;
  settings: ICallSettings;
  calls: ICall[];
}

export interface IPBXParams {
  intPhone: string;
}

export enum PBXStateEnum {
  PBX_BLOCK = 'BLOCK',
  PBX_NOCALL = 'NO_CALL',
  PBX_CALL = 'CALL',
  PBX_HOLD = 'HOLD',
  PBX_DIAL = 'DIAL'
}

export interface IPBXState {
  lineStatus: PBXStateEnum;
  agentStatus: number;
}
