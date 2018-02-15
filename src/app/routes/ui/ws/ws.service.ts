import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class WSService {
  private socket = new WebSocket('ws://localhost:9999');

  private _listener$ = Observable.create((observer: Observer<string>) => {
    this.socket.addEventListener('message', event => {
      observer.next(event.data);
    });
  });

  get listener$(): Observable<string> {
    return this._listener$;
  }

  send(message: string): void {
    this.socket.send(message);
  }
}
