import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IGridEntity } from './entity-grid.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class EntityGridService extends AbstractActionService {

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  fetchAll<T extends IGridEntity>(apiKey: string, notificationEntityKey: string): Observable<T[]> {
    return this.dataService.readAll(apiKey)
      .catch(this.notificationsService.fetchError().entity(notificationEntityKey).dispatchCallback());
  }

  delete(apiKey: string, notificationEntityKey: string, entityId: number): Observable<any> {
    return this.dataService.delete(`${apiKey}/{entityId}`, { entityId })
      .catch(this.notificationsService.deleteError().entity(notificationEntityKey).dispatchCallback());
  }
}
