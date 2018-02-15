import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { AuthService } from '@app/core/auth/auth.service';

const jwt = JSON.parse(localStorage.getItem(AuthService.TOKEN_NAME));
console.log(jwt);

@Injectable()
export class WSService {
  private socket = new WebSocket('ws://localhost:8080/wsapi/pbx/events', [ 'Bearer', jwt ]);

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
