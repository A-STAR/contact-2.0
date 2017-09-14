import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IDebt } from '../debt-processing.interface';
import { IPerson, IPersonsResponse } from './debtor.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  static FETCH_SELECTED_DEBT = 'FETCH_SELECTED_DEBT';
  static CHANGE_CURRENT_DEBT = 'CHANGE_CURRENT_DEBT';
  static FETCH_SELECTED_DEBTOR = 'FETCH_SELECTED_DEBTOR';
  static CHANGE_CURRENT_DEBTOR = 'CHANGE_CURRENT_DEBTOR';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  fetch(personId: number): Observable<IPerson> {
    return this.dataService
      .read('/persons/{personId}', { personId })
      .map((response: IPersonsResponse) => response.persons[0])
      .catch(this.notificationsService.error('errors.default.read').entity('entities.persons.gen.singular').dispatchCallback());
  }

  update(personId: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{personId}', { personId }, person)
      .catch(this.notificationsService.error('errors.default.update').entity('entities.persons.gen.singular').dispatchCallback());
  }

  currentDebt$(): Observable<IDebt> {
    return this.store.select(state => state.debt.currentDebt).distinctUntilChanged();
  }
}
