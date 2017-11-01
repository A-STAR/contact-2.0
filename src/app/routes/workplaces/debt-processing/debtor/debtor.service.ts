import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IDebt } from '../debt-processing.interface';
import { IPerson } from './debtor.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  private _debt$ = new BehaviorSubject<IDebt>(null);
  private _debtor$ = new BehaviorSubject<IPerson>(null);

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private store: Store<IAppState>,
  ) {}

  get debt$(): Observable<IDebt> {
    return this._debt$;
  }

  get debtor$(): Observable<IPerson> {
    return this._debtor$;
  }

  preloadDebt(debtId: number): void {
    this.dataService
      .read('/debts/{debtId}', { debtId })
      .subscribe(debt => this._debt$.next(debt));
  }

  preloadDebtor(debtorId: number): void {
    this.dataService
      .read('/persons/{debtorId}', { debtorId })
      .subscribe(debtor => this._debtor$.next(debtor));
  }

  /**
   * @deprecated
   */
  fetch(personId: number): Observable<IPerson> {
    return this.dataService
      .read('/persons/{personId}', { personId })
      .catch(this.notificationsService.fetchError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  /**
   * @deprecated
   */
  fetchDebt(debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId })
      .catch(this.notificationsService.fetchError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  update(personId: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{personId}', { personId }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }
}
