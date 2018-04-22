import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDynamicModule } from '@app/core/dynamic-loader/dynamic-loader.interface';

@Injectable()
export class PopupOutletService {
  readonly data = new BehaviorSubject(null);

  open(modules: IDynamicModule[][], id: string, injector: Injector): void {
    this.data.next({ modules, id, injector });
  }

  close(): void {
    this.data.next(null);
  }
}
