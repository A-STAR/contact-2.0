import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IGroupEvent } from '@app/routes/utilities/schedule/groups/events/group-events.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';


@Injectable()
export class GroupEventService extends AbstractActionService {
  private baseUrl = '/groups/{groupId}/scheduleEvent';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll(groupId: number): Observable<IGroupEvent[]> {
    return this.dataService.readAll(this.baseUrl, { groupId })
      .catch(this.notificationsService.fetchError().entity('entities.scheduleEvents.gen.plural').dispatchCallback());
  }
}
