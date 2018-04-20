import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { IPerson } from './person.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class PersonService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetch(id: number): Observable<IPerson> {
    return this.dataService.read('/persons/{id}', { id }).pipe(
      catchError(this.notificationsService.fetchError().entity('entities.persons.gen.singular').dispatchCallback()),
    );
  }

  create(person: Partial<IPerson>): Observable<number> {
    return this.dataService.create('/persons', {}, person).pipe(
      map(response => response.data[0] && response.data[0].id),
      catchError(this.notificationsService.createError().entity('entities.persons.gen.singular').dispatchCallback()),
    );
  }

  update(id: number, person: Partial<IPerson>): Observable<number> {
    return this.dataService.update('/persons/{id}', { id }, person).pipe(
      map(response => response[0] && response[0].id),
      catchError(this.notificationsService.updateError().entity('entities.persons.gen.singular').dispatchCallback()),
    );
  }
}
