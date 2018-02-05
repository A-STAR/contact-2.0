import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IReport } from './reports.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class ReportsService extends AbstractActionService {
  static MESSAGE_REPORT_SAVED = 'MESSAGE_REPORT_SAVED';

  private baseUrl = '/reports';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('REPORT_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('REPORT_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('REPORT_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('REPORT_DELETE');
  }

  fetchAll(): Observable<IReport[]> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.reports.gen.plural').dispatchCallback());
  }

  fetch(reportId: number): Observable<IReport> {
    return this.dataService.read(`${this.baseUrl}/{reportId}`, { reportId })
      .catch(this.notificationsService.fetchError().entity('entities.reports.gen.singular').dispatchCallback());
  }

  create(report: IReport): Observable<IReport> {
    return this.dataService.create(this.baseUrl, {}, report)
      .catch(this.notificationsService.createError().entity('entities.reports.gen.singular').dispatchCallback());
  }

  update(reportId: number, report: IReport): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{reportId}`, { reportId }, report)
      .catch(this.notificationsService.updateError().entity('entities.reports.gen.singular').dispatchCallback());
  }

  delete(reportId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{reportId}`, { reportId })
      .catch(this.notificationsService.deleteError().entity('entities.reports.gen.singular').dispatchCallback());
  }
}
