import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

import { IBusMessage } from './message-bus.interface';

@Injectable()
export class MessageBusService {
  private bus$ = new Subject<IBusMessage<any, any>>();

  /**
   * `box` is a temporary key/value storage for passing
   * arbitrary data between components with an option
   * to remove the passed data from the box
   * @private
   * @experimental
   * @memberof MessageBusService
   */
  private box = new Map<string, any>();

  dispatch<T, P>(type: T, key: string = null, payload: P = null): void {
    this.bus$.next({ type, key, payload });
  }

  select<T, P>(type: T, key: string = null): Observable<P> {
    return this.bus$
      .filter(message => type === message.type && (key === null || key === message.key))
      .map(message => message.payload);
  }

  passValue(key: string, payload: any): void {
    this.box.set(key, payload);
  }

  takeValue<T>(key: string): T {
    const value = this.box.get(key);
    return value === undefined ? null : value;
  }

  takeValueAndRemove<T>(key: string): T {
    const value = this.box.get(key);
    if (this.box.has(key)) {
      this.removeValue(key);
    }
    return value === undefined ? null : value;
  }

  removeValue(key: string): boolean {
    return this.box.delete(key);
  }

  purgeValues(): void {
    this.box.clear();
  }
}
