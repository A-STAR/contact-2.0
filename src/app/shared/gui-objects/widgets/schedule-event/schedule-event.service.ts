import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../core/state/state.interface';
import { IScheduleEvent, IScheduleEventEntry, IScheduleGroup } from './schedule-event.interface';

import { AbstractActionService } from '../../../../core/state/action.service';
import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class ScheduleEventService extends AbstractActionService {
  static MESSAGE_SCHEDULE_EVENT_SAVED = 'MESSAGE_SCHEDULE_EVENT_SAVED';

  private baseUrl = '/scheduleEvent';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_VIEW');
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_ADD');
  }

  fetchAll(): Observable<IScheduleEventEntry[]> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEvents.gen.plural').dispatchCallback());
  }

  fetch(eventId: number): Observable<IScheduleEvent> {
    return this.dataService.read(`${this.baseUrl}/{eventId}`, { eventId })
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  create(event: IScheduleEvent): Observable<IScheduleEvent> {
    return this.dataService.create(this.baseUrl, {}, event)
      .catch(this.notificationsService.createError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  update(eventId: number, event: IScheduleEvent): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{eventId}`, { eventId }, event)
      .catch(this.notificationsService.updateError().entity('entities.scheduleEvents.gen.singular').dispatchCallback());
  }

  fetchGroups(): Observable<IScheduleGroup[]> {
    return this.dataService
      .readAll('/filters/groups', {}, {})
      .catch(this.notificationsService.fetchError().entity('entities.groups.gen.plural').dispatchCallback());
  }
}
