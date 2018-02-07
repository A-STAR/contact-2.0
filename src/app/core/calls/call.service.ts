import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '../state/state.interface';
import { ICallState, CallStateStatusEnum, ICallSettings } from './call.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class CallService {
  static CALL_SETTINGS_FETCH = 'CALL_SETTINGS_FETCH';
  static CALL_SETTINGS_FETCH_SUCCESS = 'CALL_SETTINGS_FETCH_SUCCESS';
  static CALL_SETTINGS_FETCH_FAILURE = 'CALL_SETTINGS_FETCH_FAILURE';

  private baseUrl = 'pbx/call';

  private state: ICallState;

  constructor(
    private store: Store<IAppState>,
    private dataService: DataService,
    private notificationsService: NotificationsService
  ) {
    this.state$.subscribe(state => this.state = state);
  }

  get settings$(): Observable<ICallSettings> {
    const status = this.state && this.state.status;
    if (status !== CallStateStatusEnum.LOADED && status !== CallStateStatusEnum.PENDING) {
      this.refresh();
    }
    return this.state$
      .pipe(
        filter(state => state.status !== CallStateStatusEnum.PENDING),
        map(state => state.settings)
      );
  }

  refresh(): void {
    this.store.dispatch({
      type: CallService.CALL_SETTINGS_FETCH,
    });
  }

  makeCall(phoneId: number, debtId: number, personId: number, personRole: number): Observable<void> {
    return this.dataService
      .create(`${this.baseUrl}/make`, { }, { phoneId, debtId, personId, personRole })
      .catch(this.notificationsService.createError().entity('entities.calls.gen.plural').dispatchCallback());
  }

  private get state$(): Observable<ICallState> {
    return this.store.select(state => state.calls)
      .pipe(
        distinctUntilChanged()
      );
  }
}
