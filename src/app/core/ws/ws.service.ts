import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { tryCatch } from 'ramda';

import { IWSConnection } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class WSService {
  static EVENT_TYPE_HEARTBEAT_INTERVAL = 30000;
  static EVENT_TYPE_HEARTBEAT = 'heartbeat';

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  connect<T>(url: string): Observable<IWSConnection<T>> {
    const baseUrl = this.configService.config.api.ws;
    const listener = new BehaviorSubject<T>(null);
    // TODO: close previous connection when new token emits
    return this.authService.validToken$.pipe(
      filter(Boolean),
      distinctUntilChanged(),
      map(token => this.createWSConnection(
        this.open(baseUrl + url, token, data => listener.next(data)),
        listener
      )),
    );
  }

  private open(url: string, token: string, callback: (data: any) => void): WebSocket {
    const socket = new WebSocket(url, [ 'Authentication', `Token-${token}` ]);
    socket.addEventListener('message', event => {
      const data = tryCatch(JSON.parse, () => null)(event.data);
      if (data) {
        callback(data);
      }
    });
    return socket;
  }

  private createWSConnection<T>(socket: WebSocket, listener: BehaviorSubject<T>): IWSConnection<T> {
    const interval = setInterval(
      () => {
        if (socket.readyState === socket.OPEN) {
          socket.send(JSON.stringify({ eventType: WSService.EVENT_TYPE_HEARTBEAT }));
        }
      },
      WSService.EVENT_TYPE_HEARTBEAT_INTERVAL
    );
    return {
      listen: () => listener.asObservable(),
      send: msg => socket.send(msg),
      close: () => {
        clearInterval(interval);
        listener.unsubscribe();
        socket.close();
      }
    };
  }
}
