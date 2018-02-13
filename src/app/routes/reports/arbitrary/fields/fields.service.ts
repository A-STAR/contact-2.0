import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IReportField } from './fields.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class FieldsService extends AbstractActionService {
  static MESSAGE_FIELD_SAVED = 'MESSAGE_FIELD_SAVED';

  private baseUrl = '/reports/{reportId}/fields';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('REPORT_EDIT');
  }

  fetchAll(reportId: number): Observable<IReportField[]> {
    return this.dataService.readAll(this.baseUrl, { reportId })
      .catch(this.notificationsService.fetchError().entity('entities.fields.gen.plural').dispatchCallback());
  }

  fetch(reportId: number, fieldId: number): Observable<IReportField> {
    return this.dataService.read(`${this.baseUrl}/{fieldId}`, { reportId, fieldId })
      .catch(this.notificationsService.fetchError().entity('entities.fields.gen.singular').dispatchCallback());
  }

  create(reportId: number, field: IReportField): Observable<IReportField> {
    return this.dataService.create(this.baseUrl, { reportId }, field)
      .catch(this.notificationsService.createError().entity('entities.fields.gen.singular').dispatchCallback());
  }

  update(reportId: number, fieldId: number, field: IReportField): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{fieldId}`, { reportId, fieldId }, field)
      .catch(this.notificationsService.updateError().entity('entities.fields.gen.singular').dispatchCallback());
  }

  delete(reportId: number, fieldId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{fieldId}`, { reportId, fieldId })
      .catch(this.notificationsService.deleteError().entity('entities.fields.gen.singular').dispatchCallback());
  }
}
