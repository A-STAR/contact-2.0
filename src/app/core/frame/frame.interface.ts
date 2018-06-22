import { Observable } from 'rxjs/Observable';

export type RequestMessageParams = Record<string, any>;

export interface RequestMessage {
  operationId: number;
  params: RequestMessageParams;
  type: any;
  uid: number;
}

export interface ResponseMessage {
  uid: number;
  payload: any;
}

export type RequestHandler = (params: RequestMessageParams) => Observable<any>;
