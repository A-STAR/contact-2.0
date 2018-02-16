import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as R from 'ramda';

import { IWSData } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';

const jwt = R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.TOKEN_NAME));

@Injectable()
export class WSService {
  private socket = new WebSocket('ws://localhost:8080/wsapi/pbx/events', [ 'Authentication', `Token-${jwt}` ]);

  private _listener$ = Observable.create((observer: Observer<IWSData>) => {
    this.socket.addEventListener('message', event => {
      const data = R.tryCatch(JSON.parse, () => null)(event.data);
      if (data) {
        observer.next(data);
      }
    });
  });

  get listener$(): Observable<IWSData> {
    return this._listener$;
  }

  send(message: string): void {
    this.socket.send(message);
  }
}
