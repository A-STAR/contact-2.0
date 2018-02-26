import { Observable } from 'rxjs/Observable';

export interface IWSConnection<T> {
  listen(): Observable<T>;
  send(msg: string): void;
  close(): void;
}
