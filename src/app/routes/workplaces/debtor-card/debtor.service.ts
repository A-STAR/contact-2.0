import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IPerson } from './debtor.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class DebtorService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  update(id: number, person: IPerson): Observable<void> {
    return this.dataService
      .update('/persons/{id}', { id }, person)
      .catch(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback());
  }

  readonly debtId$ = new BehaviorSubject<number>(null);
  readonly debtorId$ = new BehaviorSubject<number>(null);
  readonly entityTypeId$ = new BehaviorSubject<number>(null);

  // readonly isCompany$ = this.store.pipe(
  //   select(state => state.debtorCard.person.data && state.debtorCard.person.data.typeCode),
  //   map(typeCode => [2, 3].includes(typeCode)),
  //   distinctUntilChanged(),
  // );

  // readonly isPerson$ = this.store.pipe(
  //   select(state => state.debtorCard.person.data && state.debtorCard.person.data.typeCode),
  //   map(typeCode => typeCode === 1),
  //   distinctUntilChanged(),
  // );

  // readonly hasDebts$ = this.store.pipe(
  //   select(state => state.debtorCard.debts.status === IDataStatus.LOADED),
  // );

  // readonly hasPerson$ = this.store.pipe(
  //   select(state => state.debtorCard.person.status === IDataStatus.LOADED),
  // );

  // readonly hasLoaded$ = this.store.pipe(
  //   select(state => state.debtorCard),
  //   map(slice => slice.debts.status === IDataStatus.LOADED && slice.person.status === IDataStatus.LOADED),
  //   distinctUntilChanged(),
  // );

  // readonly hasFailed$ = this.store.pipe(
  //   select(state => state.debtorCard),
  //   map(slice => slice.debts.status === IDataStatus.FAILED || slice.person.status === IDataStatus.FAILED),
  //   distinctUntilChanged(),
  // );
}
