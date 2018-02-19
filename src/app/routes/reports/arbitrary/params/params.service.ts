import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IReportParam } from './params.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class ParamsService extends AbstractActionService {
  static MESSAGE_PARAM_SAVED = 'MESSAGE_PARAM_SAVED';

  private baseUrl = '/reports/{reportId}/params';

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

  fetchAll(reportId: number): Observable<IReportParam[]> {
    return this.dataService.readAll(this.baseUrl, { reportId })
      .catch(this.notificationsService.fetchError().entity('entities.params.gen.plural').dispatchCallback());
  }

  fetch(reportId: number, paramId: number): Observable<IReportParam> {
    return this.dataService.read(`${this.baseUrl}/{paramId}`, { reportId, paramId })
      .catch(this.notificationsService.fetchError().entity('entities.params.gen.singular').dispatchCallback());
  }

  create(reportId: number, param: IReportParam): Observable<IReportParam> {
    return this.dataService.create(this.baseUrl, { reportId }, param)
      .catch(this.notificationsService.createError().entity('entities.params.gen.singular').dispatchCallback());
  }

  update(reportId: number, paramId: number, param: IReportParam): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{paramId}`, { reportId, paramId }, param)
      .catch(this.notificationsService.updateError().entity('entities.params.gen.singular').dispatchCallback());
  }

  delete(reportId: number, paramId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{paramId}`, { reportId, paramId })
      .catch(this.notificationsService.deleteError().entity('entities.params.gen.singular').dispatchCallback());
  }
}
