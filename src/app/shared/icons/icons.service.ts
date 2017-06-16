import { Injectable } from '@angular/core';
import { ToolbarActionTypeEnum } from '../components/toolbar/toolbar.interface';

@Injectable()
export class IconsService {

  private ACTION_ICONS_MAP = new Map([
    [ToolbarActionTypeEnum.CLONE, 'clone'],
    [ToolbarActionTypeEnum.EDIT, 'pencil'],
    [ToolbarActionTypeEnum.REMOVE, 'trash'],
    [ToolbarActionTypeEnum.ADD, 'plus'],
    [ToolbarActionTypeEnum.REFRESH, 'refresh'],
    [ToolbarActionTypeEnum.SEARCH, 'search'],
    [ToolbarActionTypeEnum.SAVE, 'save'],
    [ToolbarActionTypeEnum.FORWARD, 'step-forward'],
    [ToolbarActionTypeEnum.BACKWARD, 'step-backward'],
  ]);

  public fromActionType(actionType: ToolbarActionTypeEnum): string {
    return this.ACTION_ICONS_MAP.get(actionType) || `default-${actionType}`;
  }
}
