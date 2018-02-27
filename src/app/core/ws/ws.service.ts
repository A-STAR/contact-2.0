import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first, publishReplay, refCount } from 'rxjs/operators';
import * as R from 'ramda';

import { IWSConnection } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';

@Injectable()
export class WSService {
  private baseUrl$ = this.http.get('./assets/server/root.json')
    .pipe(
      publishReplay(1),
      refCount()
    )
    .map(response => response.ws);

  constructor(
    private http: HttpClient,
  ) {}

  connect<T>(url: string): Observable<IWSConnection<T>> {
    return this.baseUrl$
      .pipe(first())
      .map(baseUrl => {
        const listener = new BehaviorSubject<T>(null);
        return this.createWSConnection(
          this.open(baseUrl + url, data => listener.next(data)),
          listener
        );
      });
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
    return R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.TOKEN_NAME));
  }
}
