import { Injectable } from '@angular/core';
import { PaginationActionType } from './pagination.interface';

@Injectable()
export class PaginationService {
  // TODO(i.lobanov): move icons to buttons service
  private ACTION_ICONS_MAP = new Map([
    [PaginationActionType.GO_FIRST, 'angle-double-left'],
    [PaginationActionType.GO_BACKWARD, 'angle-left'],
    [PaginationActionType.GO_FORWARD, 'angle-right'],
    [PaginationActionType.GO_LAST, 'angle-double-right'],
    [PaginationActionType.REFRESH, 'refresh'],
  ]);

  getIconClass(actionType: PaginationActionType): string {
    return this.ACTION_ICONS_MAP.get(actionType) || `default-${actionType}`;
  }
}
