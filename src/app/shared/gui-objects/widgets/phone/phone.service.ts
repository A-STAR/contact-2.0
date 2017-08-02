import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPhone, IPhonesResponse } from './phone.interface';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class PhoneService {
  constructor(private dataService: DataService) {}

  fetchAll(entityType: number, entityId: number): Observable<Array<IPhone>> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/phones', { entityType, entityId })
      .map((response: IPhonesResponse) => response.phones);
  }

  fetch(entityType: number, entityId: number, phoneId: number): Observable<IPhone> {
    return this.dataService
      .read('/api/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}', { entityType, entityId, phoneId })
      .map((response: IPhonesResponse) => response.phones[0]);
  }

  create(entityType: number, entityId: number, phone: IPhone): Observable<void> {
    return this.dataService
      .create('/api/entityTypes/{entityType}/entities/{entityId}/phones/', { entityType, entityId }, phone);
  }

  update(entityType: number, entityId: number, phoneId: number, phone: Partial<IPhone>): Observable<void> {
    return this.dataService
      .update('/api/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}', { entityType, entityId, phoneId }, phone);
  }

  block(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.update(entityType, entityId, phoneId, { isBlocked: 1 });
  }

  unblock(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.update(entityType, entityId, phoneId, { isBlocked: 0 });
  }

  delete(entityType: number, entityId: number, phoneId: number): Observable<void> {
    return this.dataService
      .delete('/api/entityTypes/{entityType}/entities/{entityId}/phones/{phoneId}', { entityType, entityId, phoneId });
  }
}
