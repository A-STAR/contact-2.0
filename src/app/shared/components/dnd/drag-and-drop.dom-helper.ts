import { Injectable } from '@angular/core';
import * as R from 'ramda';

import { IIntersectedNodeInfo, INodeOffset } from './drag-and-drop.interface';

@Injectable()
export class DragAndDropDomHelper {

  private static DND_ATTRIBUTE_NAME = 'nodeid';
  private static DND_MIRROR_CLS = 'gu-mirror';

  getOffset(el: Element): INodeOffset {
    return Object.assign({ width: el.clientWidth, height: el.clientHeight }, $(el).offset());
  }

  getIntersectedByTargetElements(targetPosition: INodeOffset, elements: HTMLCollectionOf<Element>): IIntersectedNodeInfo[] {
    return targetPosition
      ? R.filter(
        (info: IIntersectedNodeInfo) => !!info,
        R.map((el: Element) => {
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

            return { element: el, x1: x1, y1: y1, x2: x2, y2: y2 };
          }
          return null;
        }, Array.from(elements))
      )
      : [];
  }

  queryElements(el: Element, selector: string): HTMLCollectionOf<Element> {
    return el.querySelectorAll(selector) as HTMLCollectionOf<Element>;
  }

  queryDragulaMirrorElement(): Element {
    return R.find((el: Element) => el.classList.contains(DragAndDropDomHelper.DND_MIRROR_CLS),
      Array.from(document.body.children));
  }

  extractNodeId(element: Element): string {
    return element.getAttribute(DragAndDropDomHelper.DND_ATTRIBUTE_NAME);
  }
}
