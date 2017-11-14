import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridRequestParams, IAGridResponse } from '../../../components/grid2/grid2.interface';

import { IContactLog } from './contact-log.interface';

import { DataService } from '../../../../core/data/data.service';
import { GridService } from '../../../components/grid/grid.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { FilterObject } from '../../../components/grid2/filter/grid-filter';

@Injectable()
export class ContactLogService {
  // constructor(
  //   private dataService: DataService,
  //   private gridService: GridService,
  //   private notificationsService: NotificationsService,
  // ) {}

  // fetchAll(
  //   personId: number,
  //   filters: FilterObject,
  //   params: IAGridRequestParams,
  // ): Observable<IAGridResponse<IContactLog>> {
  //   const request = this.gridService.buildRequest(params, filters);
  //   return this.dataService
  //     .create('/persons/{personId}/contacts?isOnlyContactLog=1', { personId }, request)
  //     .catch(this.notificationsService.fetchError().entity(`entities.contacts.gen.plural`).dispatchCallback());
  // }
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';

  private baseUrl = '/api/persons/{personId}/contacts';
  private extUrlNotSmsMessage = '/api/debts/{debtId}/contacts/{contactsLogId}';
  private extUrlSmsMessage = '/api/debts/{debtId}/sms/{contactsLogId}';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(personId: number): Observable<Array<IContactLog>> {
    return this.dataService.post(this.baseUrl, { personId }, {})
      .map(res => res.data)
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contactsLogId: number, contactType: number): Observable<IContactLog> {
    console.log('start fetch contact', arguments);
    return this.dataService.read(
      contactType < 4
        ? this.extUrlNotSmsMessage
        : this.extUrlSmsMessage,
      { debtId, contactsLogId })
      .catch(this.notificationsService.error('errors.default.read')
      .entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  create(personId: number, contact: IContactLog): Observable<IContactLog> {
    return this.dataService.create(this.baseUrl, { personId }, contact)
      .catch(this.notificationsService
        .error('errors.default.create')
        .entity('entities.contactLog.gen.singular')
        .dispatchCallback()
      );
  }

  update(personId: number, contactsId: number, contactItem: IContactLog): Observable<any> {
    return this.dataService.update(this.extUrlNotSmsMessage, { personId, contactsId }, contactItem)
      .catch(this.notificationsService
        .error('errors.default.update')
        .entity('entities.contactLog.gen.singular')
        .dispatchCallback()
      );
  }
}
