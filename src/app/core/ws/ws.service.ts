import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as R from 'ramda';

import { IWSConnection } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class WSService {
  constructor(
    private configService: ConfigService,
  ) {}

  connect<T>(url: string): IWSConnection<T> {
    const baseUrl = this.configService.config.api.ws;
    const listener = new BehaviorSubject<T>(null);
    return this.createWSConnection(
      this.open(baseUrl + url, data => listener.next(data)),
      listener
    );
  }

  private open(url: string, callback: (data: any) => void): WebSocket {
    const socket = new WebSocket(url, [ 'Authentication', `Token-${this.jwt}` ]);
    socket.addEventListener('message', event => {
      const data = R.tryCatch(JSON.parse, () => null)(event.data);
      if (data) {
        callback(data);
      }
    });
    return socket;
  }

  private createWSConnection<T>(socket: WebSocket, listener: BehaviorSubject<T>): IWSConnection<T> {
    return {
      listen: () => listener.asObservable(),
      send: msg => socket.send(msg),
      close: () => {
        listener.unsubscribe();
        socket.close();
      }
    };
  }

  private get jwt(): string {
    return R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.AUTH_TOKEN));
  }
}
