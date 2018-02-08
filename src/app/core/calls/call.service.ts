import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '../state/state.interface';
import { ICallState, CallStateStatusEnum, ICallSettings, IPBXParams } from './call.interface';

import { DataService } from '../data/data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class CallService {
  static CALL_SETTINGS_FETCH = 'CALL_SETTINGS_FETCH';
  static CALL_SETTINGS_FETCH_SUCCESS = 'CALL_SETTINGS_FETCH_SUCCESS';
  static CALL_SETTINGS_FETCH_FAILURE = 'CALL_SETTINGS_FETCH_FAILURE';

  private state: ICallState;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationsService,
    private store: Store<IAppState>,
  ) {
    this.state$.subscribe(state => this.state = state);
  }

  get settings$(): Observable<ICallSettings> {
    const status = this.state && this.state.status;
    if (!status || status === CallStateStatusEnum.ERROR) {
      this.refresh();
    }
    return this.state$
      .pipe(
        filter(state => state.status === CallStateStatusEnum.LOADED),
        map(state => state.settings)
      );
  }

  refresh(): void {
    this.store.dispatch({
      type: CallService.CALL_SETTINGS_FETCH,
    });
  }

  updatePBXParams(params: IPBXParams): Observable<void> {
    return this.dataService
      .update('/pbx/users', {}, params)
      .pipe(
        catchError(this.notificationService.updateError().entity('entities.callSettings.gen.plural').dispatchCallback()),
      );
  }

  private get state$(): Observable<ICallState> {
    return this.store.select(state => state.calls)
      .pipe(
        filter(Boolean),
        distinctUntilChanged()
      );
  }
}
