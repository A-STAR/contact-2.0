import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IScheduleEvent } from './schedule-event.interface';

import { DataService } from '../../../../core/data/data.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

@Injectable()
export class ScheduleEventService {
  private baseUrl = '/scheduleEvent';

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) { }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('SCHEDULE_VIEW');
  }

  fetchAll(): Observable<IScheduleEvent[]> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEvents.gen.plural').dispatchCallback());
  }
}
