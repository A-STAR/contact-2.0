import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter, map, take } from 'rxjs/operators';
import { tryCatch } from 'ramda';

import { IWSConnection } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { ConfigService } from '@app/core/config/config.service';

@Injectable()
export class WSService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  connect<T>(url: string): Observable<IWSConnection<T>> {
    const baseUrl = this.configService.config.api.ws;
    const listener = new BehaviorSubject<T>(null);
    return this.authService.token$.pipe(
      filter(Boolean),
      take(1),
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
    return {
      listen: () => listener.asObservable(),
      send: msg => socket.send(msg),
      close: () => {
        listener.unsubscribe();
        socket.close();
      }
    };
  }
}
