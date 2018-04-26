import { Injectable } from '@angular/core';

import { IDynamicLayoutItemProperties } from '../interface';

@Injectable()
export class FormService {
  init(items: { [key: string]: IDynamicLayoutItemProperties }): void {
    // tslint:disable-next-line:no-console
    console.log(items);
    // const attributes = Object.keys(items)
    //   .map(key => items[key].item)
    //   .filter(item => item.type === DynamicLayoutItemType.ATTRIBUTE)
    //   .map((attribute: IDynamicLayoutAttribute) => {
    //     const { attributeType, value } = attribute;
    //     return { attributeType, value };
    //   });

    // // tslint:disable-next-line:no-console
    // console.log(attributes);
  }
}
