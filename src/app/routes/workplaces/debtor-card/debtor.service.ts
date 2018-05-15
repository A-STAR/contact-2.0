import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError } from 'rxjs/operators/catchError';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators/switchMap';

import { IPerson } from './debtor.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';

import { Debtor, Debt } from '@app/entities';

@Injectable()
export class DebtorService {

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private repo: RepositoryService,
  ) {}

  update(id: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{id}', { id }, person)
      .pipe(
        catchError(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback())
      );
  }

  readonly debtId$ = new BehaviorSubject<number>(null);
  readonly debtorId$ = new BehaviorSubject<number>(null);
  readonly entityTypeId$ = new BehaviorSubject<number>(null);

  readonly debtor$ = this.debtorId$
    .pipe(
      filter(Boolean),
      switchMap(debtorId => this.repo.fetch(Debtor, { id: debtorId })),
      map(debtors => debtors && debtors[0])
    );

  readonly debt$ = this.debtId$
    .pipe(
      filter(Boolean),
      switchMap(debtId => this.repo.fetch(Debt, { id: debtId })),
      map(debtors => debtors && debtors[0])
    );

  readonly isCompany$ = this.debtor$
    .pipe(
      map(debtor => [2, 3].includes(debtor.typeCode)),
      distinctUntilChanged()
    );

  readonly isPerson$ = this.debtor$
    .pipe(
      map(debtor => debtor.typeCode === 1),
      distinctUntilChanged()
    );

}
