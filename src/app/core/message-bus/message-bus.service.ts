import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';

import { IBusMessage } from './message-bus.interface';

@Injectable()
export class MessageBusService {
  private bus$ = new Subject<IBusMessage<any, any>>();

  /**
   * Please prefer using the store's dispatch to pass arbitrary data to other components
   * @deprecated
   * @param type
   * @param key
   * @param payload
   */
  dispatch<T, P>(type: T, key: string = null, payload: P = null): void {
    this.bus$.next({ type, key, payload });
  }
  /**
   * Please prefer using the store's Actions observable to catch actions emitted from other components
   * @ deprecated
   * @param type
   * @param key
   */
  select<T, P>(type: T, key: string = null): Observable<P> {
    return this.bus$
      .pipe(
        filter(message => type === message.type && (key === null || key === message.key)),
        map(message => message.payload)
      );
  }
}
