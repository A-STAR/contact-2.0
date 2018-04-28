import { Injectable } from '@angular/core';
import { getIn, setIn } from 'immutable';

import { PersistenceService } from '@app/core/persistence/persistence.service';

@Injectable()
export class GroupService {
  constructor(
    private persistenceService: PersistenceService,
  ) {}

  getSplittersConfig(key: string, uid: string): number[] {
    const layout = this.persistenceService.get('layout') || {};
    const sizes = getIn(layout, [ key, uid ], null);
    return sizes
      ? sizes.split(',').map(Number)
      : null;
  }

  setSplittersConfig(key: string, uid: string, sizes: number[]): void {
    const layout = this.persistenceService.get('layout') || {};
    const newLayout = setIn(layout, [ key, uid ], sizes.join(','));
    this.persistenceService.set('layout', newLayout);
  }
}
