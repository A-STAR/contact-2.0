import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter, first, map } from 'rxjs/operators';

import {
  FrameMessageDirection,
  FrameMessageType,
  IFrameRequestMessage,
  IFrameResponseMessage,
} from './custom-operation-params.interface';

import { LookupService } from '@app/core/lookup/lookup.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Injectable()
export class CustomOperationParamsService {

  private operationId: number;
  private operationParams: any[];

  readonly messages$ = new BehaviorSubject<IFrameResponseMessage>(null);

  constructor(
    private lookupService: LookupService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  init(operationId: number, operationParams: any[]): Observable<IFrameResponseMessage> {
    this.operationId = operationId;
    this.operationParams = operationParams;
    fromEvent(window, 'message')
      .pipe(
        map((message: MessageEvent) => message.data as IFrameRequestMessage),
        filter(message => message.direction === FrameMessageDirection.REQUEST && message.operationId === this.operationId),
      )
      .subscribe(message => {
        switch (message.type) {
          case FrameMessageType.DICTIONARY:
            this.onDictionaryMessage(message.params);
            break;
          case FrameMessageType.INIT:
            this.onInitMessage();
            break;
          case FrameMessageType.LOOKUP:
            this.onLookupMessage(message.params);
            break;
        }
      });
    return this.messages$.asObservable();
  }

  private onDictionaryMessage(params: any): void {
    this.userDictionariesService
      .getDictionary(params.code)
      .pipe(
        first(),
      )
      .subscribe(payload => this.nextMessage(FrameMessageType.DICTIONARY, params, payload));
  }

  private onInitMessage(): void {
    this.nextMessage(FrameMessageType.INIT, null, this.operationParams);
  }

  private onLookupMessage(params: any): void {
    this.lookupService
      .lookup(params.code)
      .pipe(
        first(),
      )
      .subscribe(payload => this.nextMessage(FrameMessageType.LOOKUP, params, payload));
  }

  private nextMessage(type: FrameMessageType, params: any, payload: any): void {
    const message: IFrameResponseMessage = {
      type,
      direction: FrameMessageDirection.RESPONSE,
      operationId: this.operationId,
      params,
      payload,
    };
    this.messages$.next(message);
  }
}
