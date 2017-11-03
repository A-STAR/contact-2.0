import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IConstant, IConstantsState } from './constants.interface';

import { DataService } from '../../../core/data/data.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

@Injectable()
export class ConstantsService {
  static STORAGE_KEY = 'state/constants';

  static CONSTANT_SELECT        = 'CONSTANT_SELECT';

  private baseUrl = '/constants';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  get state(): Observable<IConstantsState> {
    return this.store.select(state => state.constants)
      .filter(Boolean);
  }

  fetchAll(): Observable<IConstant[]> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.users.gen.plural').dispatchCallback());
  }

  update(id: number, constant: IConstant): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{id}`, { id }, constant)
      .catch(this.notificationsService.updateError().entity('entities.users.gen.plural').dispatchCallback());
  }

  changeSelected(payload: IConstant): void {
    this.store.dispatch({
      type: ConstantsService.CONSTANT_SELECT,
      payload
    });
  }
}
