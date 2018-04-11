import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IPopup } from './popup-outlet.interface';

@Injectable()
export class PopupOutletService {
  readonly popup = new BehaviorSubject<IPopup>(null);

  open(id: string, outlet: string = 'main'): void {
    this.popup.next({ id, outlet });
  }

  close(): void {
    this.popup.next(null);
  }
}
