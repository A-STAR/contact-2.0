import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';

import { IBusMessage } from './message-bus.interface';

@Injectable()
export class MessageBusService {
  private bus$ = new Subject<IBusMessage<any, any>>();

  dispatch<T, P>(type: T, key: string = null, payload: P = null): void {
    this.bus$.next({ type, key, payload });
  }

  select<T, P>(type: T, key: string = null): Observable<P> {
    return this.bus$
      .filter(message => type === message.type && (key === null || key === message.key))
      .map(message => message.payload);
  }
}
