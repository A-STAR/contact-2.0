export enum FrameMessageType {
  DICTIONARY = 'dictionary',
  INIT       = 'init',
  LOOKUP     = 'lookup',
}

export enum FrameMessageDirection {
  REQUEST  = 'request',
  RESPONSE = 'response',
}

export interface IFrameRequestMessage {
  type: FrameMessageType;
  direction: FrameMessageDirection.REQUEST;
  operationId: number;
  params: Record<string, any>;
}

export interface IFrameResponseMessage {
  type: FrameMessageType;
  direction: FrameMessageDirection.RESPONSE;
  operationId: number;
  params: Record<string, any>;
  payload: any;
}

export type IFrameMessage = IFrameRequestMessage | IFrameResponseMessage;
