import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter, first, map, shareReplay, mergeMap } from 'rxjs/operators';

import { RequestMessage, RequestMessageParams, ResponseMessage, RequestHandler } from './frame.interface';

@Injectable()
export class FrameService {

  private counter = 0;

  private messages$ = fromEvent(window, 'message')
    .pipe(
      map((message: MessageEvent) => message.data),
      shareReplay(),
    );

  constructor() {
    this.messages$.subscribe();
  }

  getRequest(operationId: number, type: any): Observable<RequestMessage> {
    return this.messages$
      .pipe(
        filter((message: RequestMessage) => message.operationId === operationId && message.type === type),
      );
  }

  handleRequest(target: () => Window, operationId: number, type: any, handler: RequestHandler): Subscription {
    return this.messages$
      .pipe(
        filter((message: RequestMessage) => message.operationId === operationId && message.type === type),
        mergeMap(request => {
          return handler(request.params).pipe(
            first(),
            map(payload => ({
              payload,
              uid: request.uid,
            })),
          );
        }),
      )
      .subscribe(response => {
        const t = target();
        if (t) {
          t.postMessage(response, '*');
        }
      });
  }

  sendMessage(target: Window, operationId: number, type: any, params: RequestMessageParams = {}): Observable<any> {
    const uid = this.counter++;
    const request: RequestMessage = {
      operationId,
      type,
      params,
      uid,
    };
    target.postMessage(request, '*');
    return this.messages$.pipe(
      filter((message: ResponseMessage) => message.uid === uid),
      first(),
      map(message => message.payload),
    );
  }
}
