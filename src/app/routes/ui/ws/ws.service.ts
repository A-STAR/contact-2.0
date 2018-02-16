import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as R from 'ramda';

import { IWSData } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';

const jwt = R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.TOKEN_NAME));

@Injectable()
export class WSService {
  private socket: WebSocket;

  private _listener$ = new BehaviorSubject<IWSData>(null);

  get listener$(): Observable<IWSData> {
    return this._listener$;
  }

  open(): void {
    this.socket = new WebSocket('ws://localhost:8080/wsapi/pbx/events', [ 'Authentication', `Token-${jwt}` ]);
    this.socket.addEventListener('message', event => {
      const data = R.tryCatch(JSON.parse, () => null)(event.data);
      if (data) {
        this._listener$.next(data);
      }
    });
  }

  close(): void {
    this.socket.close();
  }

  send(message: string): void {
    this.socket.send(message);
  }
}
