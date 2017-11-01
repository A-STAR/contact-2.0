import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
    this.preloadDebt(this.debtId);
    this.preloadDebtor(this.debtorId);
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get debtorId(): number {
    return this.routeParams.debtorId;
  }

  get debt$(): Observable<IDebt> {
    return this._debt$;
  }

  get debtor$(): Observable<IPerson> {
    return this._debtor$;
  }

  update(personId: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{personId}', { personId }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  private get routeParams(): { [key: string]: number } {
    return (this.route.params as any).value;
  }

  private preloadDebt(debtId: number): void {
    this.dataService
      .read('/debts/{debtId}', { debtId })
      .subscribe(debt => this._debt$.next(debt));
  }

  private preloadDebtor(debtorId: number): void {
    this.dataService
      .read('/persons/{debtorId}', { debtorId })
      .subscribe(debtor => this._debtor$.next(debtor));
  }
}
