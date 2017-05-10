import { Injectable } from '@angular/core';
import { ToolbarActionTypeEnum } from '../components/toolbar/toolbar.interface';

@Injectable()
export class IconsService {

  private ACTION_ICONS_MAP = new Map([
    [ToolbarActionTypeEnum.CLONE, 'clone'],
    [ToolbarActionTypeEnum.EDIT, 'pencil'],
    [ToolbarActionTypeEnum.REMOVE, 'trash'],
    [ToolbarActionTypeEnum.ADD, 'plus']
  ]);

  public fromActionType(actionType: ToolbarActionTypeEnum) {
    return this.ACTION_ICONS_MAP.get(actionType) || `default-${actionType}`;
  }
}
