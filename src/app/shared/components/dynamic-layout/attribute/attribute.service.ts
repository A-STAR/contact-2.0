import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, map } from 'rxjs/operators';

import {
  DynamicLayoutItemType,
  IDynamicLayoutAttribute,
  IDynamicLayoutItemProperties,
  IDynamicLayoutItem,
} from '../dynamic-layout.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  readonly attributes$ = new BehaviorSubject<Record<string, any>>(null);

  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  init(items: Record<string, IDynamicLayoutItemProperties<IDynamicLayoutItem>>): void {
    const attributes = Object.keys(items)
      .map(key => items[key].item)
      .filter(item => item.type === DynamicLayoutItemType.ATTRIBUTE)
      .reduce((acc, attribute: IDynamicLayoutAttribute) => ({ ...acc, [attribute.key]: attribute.formula }), {});

    const data = {
      // TODO(d.maltsev): fix hardcoded context
      context: {
        debtId: 1,
      },
      attributes,
    };

    this.dataService
      .create('/customAttributes', {}, data)
      .pipe(
        map(response => response.data[0]),
        catchError(this.notificationsService.fetchError().dispatchCallback()),
      )
      .subscribe(result => this.attributes$.next(result));
  }
}
