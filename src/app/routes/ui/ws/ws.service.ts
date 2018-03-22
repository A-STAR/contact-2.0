import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as R from 'ramda';

import { IWSData } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { ConfigService } from '@app/core/config/config.service';

const jwt = R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.AUTH_TOKEN));

@Injectable()
export class WSService {
  private socket: WebSocket;

  private _listener$ = new BehaviorSubject<IWSData>(null);

  constructor(
    private configService: ConfigService,
  ) {}

  get listener$(): Observable<IWSData> {
    return this._listener$;
  }

  open(): void {
    const baseUrl = this.configService.config.api.ws;
    this.socket = new WebSocket(`${baseUrl}/wsapi/pbx/events`, [ 'Authentication', `Token-${jwt}` ]);
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
