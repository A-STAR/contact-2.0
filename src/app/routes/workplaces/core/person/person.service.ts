import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { IPerson, IPersonCreateResponse } from './person.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PersonService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  create(person: Partial<IPerson>): Observable<IPersonCreateResponse> {
    return this.dataService.create('/persons', {}, person).pipe(
      tap(console.log),
      map(response => response.data[0] && response.data[0].id),
      tap(console.log),
      catchError(this.notificationsService.createError().entity('entities.persons.gen.singular').dispatchCallback()),
    );
  }

  update(id: number, person: Partial<IPerson>): Observable<IPersonCreateResponse> {
    return this.dataService.update('/persons/{id}', { id }, person).pipe(
      map(response => response[0] && response[0].id),
      catchError(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback()),
    );
  }
}
