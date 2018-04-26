import { Injectable } from '@angular/core';
// import { catchError } from 'rxjs/operators/catchError';

import {
  // IAttributePayload,
  IDynamicLayoutItemProperties,
  DynamicLayoutItemType,
  IDynamicLayoutAttribute,
} from '@app/shared/components/dynamic-layout/interface';

// import { DataService } from '@app/core/data/data.service';
// import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class AttributeService {
  constructor(
    // private dataService: DataService,
    // private notificationsService: NotificationsService,
  ) {}

  getAttributes(items: IDynamicLayoutItemProperties[]): void {
    const attributes = items
      .map(i => i.item)
      .filter(item => item.type === DynamicLayoutItemType.ATTRIBUTE)
      .map((attribute: IDynamicLayoutAttribute) => {
        const { attributeType, value } = attribute;
        return { attributeType, value };
      });

    // tslint:disable-next-line:no-console
    console.log(attributes);
  }

  // private fetchAttributes(config: IAttributePayload): any {
  //   this.dataService
  //     .create('/customAttributes', {}, config)
  //     .pipe(
  //       catchError(this.notificationsService.fetchError().dispatchCallback()),
  //     );
  // }
}
