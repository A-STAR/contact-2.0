import { Injectable } from '@angular/core';

import { INodeOffset } from './drag-and-drop.interface';

@Injectable()
export class DragAndDropDomHelper {

  public getOffset(el: Element): INodeOffset {
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

  public getIntersectedByTargetElements(targetPosition: INodeOffset, elements: HTMLCollectionOf<Element>): Element[] {
    const targetElements: Element[] = [];

    if (!targetPosition) {
      return targetElements;
    }

    Array.prototype.forEach.call(elements, (el: Element) => {
      const elPos: INodeOffset = this.getOffset(el);
      const x1: number = elPos.left;
      const x2: number = elPos.left + elPos.width;
      const y1: number = elPos.top;
      const y2: number = elPos.top + elPos.height;

      const x1Mirror: number = targetPosition.left;
      const x2Mirror: number = targetPosition.left + targetPosition.width;
      const y1Mirror: number = targetPosition.top;
      const y2Mirror: number = targetPosition.top + targetPosition.height;

      if ((x1 <= x1Mirror && x1Mirror <= x2 && y1 <= y1Mirror && y1Mirror <= y2) ||
        (x1 <= x2Mirror && x2Mirror <= x2 && y1 <= y1Mirror && y1Mirror <= y2) ||
        (x1 <= x1Mirror && x1Mirror <= x2 && y1 <= y2Mirror && y2Mirror <= y2) ||
        (x1 <= x2Mirror && x2Mirror <= x2 && y1 <= y2Mirror && y2Mirror <= y2)) {
        targetElements.push(el);
      }
    });
    return targetElements;
  }
}
