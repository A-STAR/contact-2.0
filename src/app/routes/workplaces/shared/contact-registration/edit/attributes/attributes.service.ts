import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IContactTreeAttribute } from '@app/routes/utilities/contact-properties/contact-properties.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';


@Injectable()
export class AttributesService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  fetchAll(debtId: number, contactType: number, treeResultId: number): Observable<IContactTreeAttribute[]> {
    const url = '/debts/{debtId}/contactTypes/{contactType}/treeResults/{treeResultId}/attributes';
    return this.dataService
      .readAll(url, { debtId, contactType, treeResultId })
      .catch(this.notificationsService.fetchError().entity('entities.attributes.gen.plural').dispatchCallback());
  }

  create(debtId: number, guid: string, attributes: any): Observable<any> {
    return this.dataService
      .create('/debts/{debtId}/contactRequest/{guid}/attributes', { debtId, guid }, attributes)
      .catch(this.notificationsService.createError().entity('entities.attributes.gen.singular').dispatchCallback());
  }
}
