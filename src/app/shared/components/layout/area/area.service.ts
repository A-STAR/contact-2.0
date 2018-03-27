import { Injectable } from '@angular/core';

import { PersistenceService } from '@app/core/persistence/persistence.service';

@Injectable()
export class AreaService {
  constructor(
    private persistenceService: PersistenceService,
  ) {}

  clearState(persistenceKey: string): void {
    this.persistenceService.remove(persistenceKey);
  }

  getState(persistenceKey: string, id: string): number {
    if (id) {
      const state = this.persistenceService.get(persistenceKey);
      return state ? state[id] : null;
    }
    return null;
  }

  saveState(persistenceKey: string, id: string, size: number): void {
    const state = this.persistenceService.get(persistenceKey) || {};
    this.persistenceService.set(persistenceKey, { ...state, [id]: size });
  }
}
