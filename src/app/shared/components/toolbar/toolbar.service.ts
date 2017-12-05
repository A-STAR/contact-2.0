import { Injectable } from '@angular/core';
import { ToolbarActionTypeEnum } from './toolbar.interface';

@Injectable()
export class ToolbarService {

  private ACTION_ICONS_MAP = new Map([
    [ToolbarActionTypeEnum.GO_FIRST, 'angle-double-left'],
    [ToolbarActionTypeEnum.GO_BACKWARD, 'angle-left'],
    [ToolbarActionTypeEnum.GO_FORWARD, 'angle-right'],
    [ToolbarActionTypeEnum.GO_LAST, 'angle-double-right'],
    [ToolbarActionTypeEnum.REFRESH, 'refresh'],
  ]);

  getIconClass(actionType: ToolbarActionTypeEnum): string {
    return this.ACTION_ICONS_MAP.get(actionType) || `default-${actionType}`;
  }
}
