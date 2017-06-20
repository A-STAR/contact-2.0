import { EventEmitter } from '@angular/core';
import 'rxjs/add/operator/debounceTime';

import { IClickableComponent, IClickableComponentPlugin } from '../tree.interface';

export class ClickComponentPlugin implements IClickableComponentPlugin {

  private static DELAY_TIMEOUT = 200;

  private clickEventsQueue: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(component: IClickableComponent) {
    this.clickEventsQueue
      .debounceTime(ClickComponentPlugin.DELAY_TIMEOUT)
      .subscribe((event: MouseEvent) => {
        switch (event.type) {
          case 'dblclick':
            component.onDoubleClick(event);
            break;
          default:
            component.onClick(event);
        }
      });
  }

  delegateClick(event: MouseEvent): void {
    this.stopEvent(event);
    this.clickEventsQueue.emit(event);
  }

  stopEvent($event: Event): void {
    $event.stopPropagation();
    $event.preventDefault();
  }
}