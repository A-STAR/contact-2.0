import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first, publishReplay, refCount } from 'rxjs/operators';
import * as R from 'ramda';

import { IWSData } from './ws.interface';

import { AuthService } from '@app/core/auth/auth.service';

const jwt = R.tryCatch(JSON.parse, () => null)(localStorage.getItem(AuthService.AUTH_TOKEN));

@Injectable()
export class WSService {
  private socket: WebSocket;

  private _listener$ = new BehaviorSubject<IWSData>(null);

  private baseUrl$ = this.http.get('./assets/server/root.json')
    .pipe(
      publishReplay(1),
      refCount()
    )
    .map(response => response.ws);

  constructor(
    private http: HttpClient,
  ) {}

  get listener$(): Observable<IWSData> {
    return this._listener$;
  }

  open(): void {
    this.baseUrl$
      .pipe(first())
      .subscribe(baseUrl => {
        this.socket = new WebSocket(`${baseUrl}/wsapi/pbx/events`, [ 'Authentication', `Token-${jwt}` ]);
        this.socket.addEventListener('message', event => {
          const data = R.tryCatch(JSON.parse, () => null)(event.data);
          if (data) {
            this._listener$.next(data);
          }
        });
      });
  }

  close(): void {
    this.socket.close();
  }

  send(message: string): void {
    this.socket.send(message);
  }
}
