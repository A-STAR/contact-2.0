import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

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
    private route: ActivatedRoute,
  ) {
    this.preloadDebt(this.debtId).subscribe(debt => {
      this.preloadDebtor(debt.personId).subscribe();
    });
  }

  get debt$(): Observable<IDebt> {
    return this._debt$;
  }

  get debtor$(): Observable<IPerson> {
    return this._debtor$;
  }

  update(person: IPerson): Observable<void> {
    const debtorId = this._debtor$.value.id;
    return this.dataService
      .update('/persons/{debtorId}', { debtorId }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  private preloadDebt(debtId: number): Observable<IDebt> {
    return this.dataService
      .read('/debts/{debtId}', { debtId })
      .do((debt: IDebt) => {
        this._debt$.next(debt);
      });
  }

  private preloadDebtor(debtorId: number): Observable<IPerson> {
    return this.dataService
      .read('/persons/{debtorId}', { debtorId })
      .do((debtor: IPerson) => {
        this._debtor$.next(debtor);
      });
  }

  private get debtId(): number {
    return this.routeParams.debtId;
  }

  private get routeParams(): { [key: string]: number } {
    return (this.route.params as any).value;
  }
}
