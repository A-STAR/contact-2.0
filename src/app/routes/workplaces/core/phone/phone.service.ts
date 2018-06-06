import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IPhone, ISMSSchedule } from './phone.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RepositoryService } from '@app/core/repository/repository.service';
import { Phone } from '@app/entities';
import { first } from 'rxjs/operators/first';
import { map } from 'rxjs/operators/map';

@Injectable()
export class PhoneService extends AbstractActionService {
  static MESSAGE_PHONE_SAVED = 'MESSAGE_PHONE_SAVED';
  baseUrl = '/entityTypes/{entityType}/entities/{entityId}/phones';
  singular = 'entities.phones.gen.singular';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private repo: RepositoryService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(entityType: number, entityId: number, callCenter: boolean): Observable<Phone[]> {
    return this.repo.fetch(Phone, { entityType, entityId, callCenter });
  }

  refreshPhones(entityType: number, entityId: number, callCenter: boolean): void {
    this.repo.refresh(Phone, { entityType, entityId, callCenter });
  }

  fetch(entityType: number, entityId: number, phoneId: number, callCenter: boolean): Observable<Phone> {
    return this.repo.fetch(Phone, { entityType, entityId, callCenter, phoneId }).pipe(
      first(),
      map(phones => phones && phones[0])
    );
  }

  create(entityType: number, entityId: number, callCenter: boolean, phone: IPhone): Observable<void> {
    return this.dataService
      .create(this.baseUrl, { entityType, entityId }, phone, { params: { callCenter } })
      .catch(
        this.notificationsService
          .createError()
          .context('widgets.phone.card')
          .entity(this.singular)
          .dispatchCallback()
      );
  }

  update(
    entityType: number,
    entityId: number,
    phoneId: number,
    callCenter: boolean,
    phone: Partial<IPhone>,
  ): Observable<void> {
    return this.dataService
      .update(`${this.baseUrl}/{phoneId}`, { entityType, entityId, phoneId }, phone, { params: { callCenter } })
      .catch(
        this.notificationsService
          .updateError()
          .context('widgets.phone.card')
          .entity(this.singular)
          .dispatchCallback()
      );
  }

  block(
    entityType: number,
    entityId: number,
    phoneId: number,
    callCenter: boolean,
    inactiveReasonCode: number,
  ): Observable<void> {
    return this.update(entityType, entityId, phoneId, callCenter, { isInactive: 1, inactiveReasonCode });
  }

  unblock(entityType: number, entityId: number, phoneId: number, callCenter: boolean): Observable<void> {
    return this.update(entityType, entityId, phoneId, callCenter, { isInactive: 0 });
  }

  scheduleSMS(debtId: number, schedule: ISMSSchedule): Observable<void> {
    return this.dataService
      .create('/debts/{debtId}/sms', { debtId }, schedule)
      .catch(this.notificationsService.createError().entity('entities.sms.gen.singular').dispatchCallback());
  }

  delete(entityType: number, entityId: number, phoneId: number, callCenter: boolean): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{phoneId}`, { entityType, entityId, phoneId }, { params: { callCenter } })
      .catch(this.notificationsService.deleteError().entity(this.singular).dispatchCallback());
  }
}
