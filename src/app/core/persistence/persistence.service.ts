import { Injectable /*, Inject, forwardRef */ } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { Observable } from 'rxjs/Observable';
// import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PersistenceService extends AbstractActionService {
  static LAYOUT_KEY = 'state/layout';

  static PERSISTENCE_GET = 'PERSISTENCE_GET';
  static PERSISTENCE_SET = 'PERSISTENCE_SET';
  static PERSISTENCE_DELETE = 'PERSISTENCE_DELETE';
  static PERSISTENCE_ERROR = 'PERSISTENCE_ERROR';

  // constructor(@Inject(forwardRef(() => NotificationsService)) private notifications: NotificationsService) {}
  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>
  ) {
    super();
  }

  get(key: string): any {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      this.dispatchGet(key, value);
      return value;
    } catch (error) {
      // remove the key if its contents cannot be parsed
      localStorage.removeItem(key);
      this.dispatchError(key, error);
      return null;
    }
  }

  getOr(key: string, orValue: any): any {
    try {
      const result = JSON.parse(localStorage.getItem(key));
      const value = result !== null ? result : orValue;
      this.dispatchGet(key, value);
      return value;
    } catch (error) {
      // remove the key if its contents cannot be parsed
      localStorage.removeItem(key);
      this.dispatchError(key, error, orValue);
      return orValue;
    }
  }

  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.dispatchSet(key, value);
    } catch (error) {
      // TODO(a.tymchuk): figure out a way to log a notification
      // this.notifications.error(error).noAlert().dispatch();
      console.warn(error);
      this.dispatchError(key, error, value);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
    this.dispatchDelete(key);
  }

  get onGet$(): Observable<any> {
    return this.actions.ofType(PersistenceService.PERSISTENCE_GET);
  }

  get onSet$(): Observable<any> {
    return this.actions.ofType(PersistenceService.PERSISTENCE_SET);
  }

  get onDelete$(): Observable<any> {
    return this.actions.ofType(PersistenceService.PERSISTENCE_DELETE);
  }

  get onError$(): Observable<any> {
    return this.actions.ofType(PersistenceService.PERSISTENCE_ERROR);
  }

  private dispatchGet(key: string, value: any): void {
    this.dispatchAction(
      PersistenceService.PERSISTENCE_GET,
      {
        data: { [key]: value },
      }
    );
  }

  private dispatchSet(key: string, value: any): void {
    this.dispatchAction(
      PersistenceService.PERSISTENCE_SET,
      {
        data: { [key]: value },
      }
    );
  }

  private dispatchDelete(key: string): void {
    this.dispatchAction(
      PersistenceService.PERSISTENCE_DELETE,
      { data: { key } },
    );
  }

  private dispatchError(key: string, error: any, value: any = key): void {
    this.dispatchAction(
      PersistenceService.PERSISTENCE_ERROR,
      {
        data: { [key]: value },
        error
      }
    );
  }
}
