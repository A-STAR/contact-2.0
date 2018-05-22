import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ActionsLogService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  logOpenAction(duration: number, personId: number): Observable<void> {
    const data = { typeCode: 1, duration, personId };
    return this.dataService
      .create('/actions', {}, data)
      .pipe(
        // TODO(d.maltsev): i18n
        catchError(this.notificationsService.error('').dispatchCallback()),
      );
  }
}
