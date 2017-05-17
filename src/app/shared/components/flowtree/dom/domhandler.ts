import {Injectable} from '@angular/core';

import {INodeOffset} from '../tree.interface';

@Injectable()
export class DomHandler {

  getOffset(el: Element): INodeOffset {
    const originalElement: HTMLElement = el as HTMLElement;
    let currentElement: HTMLElement = el as HTMLElement;

    let x = 0;
    let y = 0;
    while (currentElement && !isNaN(currentElement.offsetLeft) && !isNaN(currentElement.offsetTop)) {
      x += currentElement.offsetLeft - currentElement.scrollLeft;
      y += currentElement.offsetTop - currentElement.scrollTop;
      currentElement = currentElement.offsetParent as HTMLElement;
    }
    return {top: y, left: x, width: originalElement.clientWidth, height: originalElement.clientHeight};
  }
}
