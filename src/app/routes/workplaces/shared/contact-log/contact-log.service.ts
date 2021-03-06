import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IAGridResponse, IAGridRequestParams } from '@app/shared/components/grid2/grid2.interface';
import { IContactLog } from './contact-log.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';


@Injectable()
export class ContactLogService extends AbstractActionService {
  static COMMENT_CONTACT_LOG_SAVED = 'COMMENT_CONTACT_LOG_SAVED';
  static CONTACT_TYPE_EMAIL = 6;
  static CONTACT_TYPE_SMS = 4;
  static CONTACT_TYPE_LETTER = 5;

  private baseUrl = '/persons/{personId}/contacts';
  private urlDefault = '/debts/{debtId}/contacts/{contactsLogId}';
  private urlSMS = '/debts/{debtId}/sms/{contactsLogId}';
  private urlEmail = '/debts/{debtId}/email/{contactsLogId}';
  private urlLetter = '/debts/{debtId}/letter/{contactsLogId}';

  constructor(
    protected actions: Actions,
    private gridService: GridService,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get letteExportAction(): IMetadataAction {
    return {
      action: 'letterExport',
      label: 'modules.infoDebt.letter.grid',
    };
  }

  fetchAll(personId: number, callCenter: boolean): Observable<Array<IContactLog>> {
    return this.dataService.create(this.baseUrl, { personId }, {}, { params: { callCenter } })
      .map(res => res.data)
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetchGridData(personId: number, callCenter: boolean,
      filters: FilterObject, params: IAGridRequestParams): Observable<IAGridResponse<IContactLog>> {

    const request = this.gridService.buildRequest(params, filters);

    return this.dataService.create(this.baseUrl, { personId }, request, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.plural').dispatchCallback());
  }

  fetch(debtId: number, contactsLogId: number, contactType: number, callCenter: boolean): Observable<IContactLog> {
    switch (contactType) {
      case ContactLogService.CONTACT_TYPE_SMS:
        return this.fetchSmsContact(debtId, contactsLogId, contactType, callCenter);
      case ContactLogService.CONTACT_TYPE_EMAIL:
        return this.fecthEmailContact(debtId, contactsLogId, contactType, callCenter);
      case ContactLogService.CONTACT_TYPE_LETTER:
        return this.fecthLetterContact(debtId, contactsLogId, contactType, callCenter);
      default:
        return this.fetchDefaultContact(debtId, contactsLogId, contactType, callCenter);
    }
  }

  fetchDefaultContact(debtId: number, contactsLogId: number, _: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlDefault, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  fetchSmsContact(debtId: number, contactsLogId: number, _: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlSMS, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  fecthEmailContact(debtId: number, contactsLogId: number, _: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlEmail, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  fecthLetterContact(debtId: number, contactsLogId: number, _: number, callCenter: boolean): Observable<IContactLog> {
    return this.dataService.read(this.urlLetter, { debtId, contactsLogId }, { params: { callCenter } })
      .catch(this.notificationsService.fetchError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }

  update(debtId: number, contactsLogId: number, comment: string): Observable<any> {
    return this.dataService.update(this.urlDefault, { debtId, contactsLogId }, { comment })
      .catch(this.notificationsService.updateError().entity('entities.contactLog.gen.singular').dispatchCallback());
  }
}
