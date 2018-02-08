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
}

export interface ICallState {
  status: CallStateStatusEnum;
  settings: ICallSettings;
  call: ICall;
}

export enum CallStateStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}
