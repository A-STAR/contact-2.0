import { Injectable } from '@angular/core';
import { getIn, setIn } from 'immutable';

import { PersistenceService } from '@app/core/persistence/persistence.service';

@Injectable()
export class GroupService {
  private LAYOUT_KEY = 'layout';

  constructor(
    private persistenceService: PersistenceService,
  ) {}

  getSplittersConfig(key: string, uid: string): number[] {
    const layout = this.persistenceService.get(this.LAYOUT_KEY) || {};
    const sizes = getIn(layout, [ key, uid ], null);
    return sizes
      ? sizes.split(',').map(Number)
      : null;
  }

  setSplittersConfig(key: string, uid: string, sizes: number[]): void {
    const layout = this.persistenceService.get(this.LAYOUT_KEY) || {};
    const newLayout = setIn(layout, [ key, uid ], sizes.join(','));
    this.persistenceService.set(this.LAYOUT_KEY, newLayout);
  }
}
