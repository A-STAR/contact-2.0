import { Observable } from 'rxjs/Observable';

export type RequestMessageParams = Record<string, any>;

export enum MessageDirection {
  REQUEST  = 'request',
  RESPONSE = 'response',
}

export interface RequestMessage {
  direction: MessageDirection.REQUEST;
  operationId: number;
  params: RequestMessageParams;
  type: any;
  uid: number;
}

export interface ResponseMessage {
  direction: MessageDirection.RESPONSE;
  uid: number;
  payload: any;
}

export type RequestHandler = (params: RequestMessageParams) => Observable<any>;
