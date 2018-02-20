export interface ICallSettings {
  useIntPhone?: number;
  usePreview?: number;
  previewShowRegContact?: number;
  useMakeCall?: number;
  useDropCall?: number;
  useHoldCall?: number;
  useRetrieveCall?: number;
  useTransferCall?: number;
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
  settings: ICallSettings;
  calls: ICall[];
}

export interface IPBXParams {
  intPhone: string;
}
