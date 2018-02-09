export interface ICallSettings {
  useIntPhone?: number;
  usePreview?: number;
  previewShowRegContact?: number;
  useMakeCall?: number;
  useDropCall?: number;
  useHoldCall?: number;
  useRetriveCall?: number;
  useTransferCall?: number;
}

export interface ICall {
  id?: number;
  phoneId: number;
  debtId: number;
  personId: number;
  personRole: number;
  onHold?: boolean;
}

export interface ICallState {
  settings: ICallSettings;
  calls: ICall[];
}

export interface IPBXParams {
  intPhone: string;
}
