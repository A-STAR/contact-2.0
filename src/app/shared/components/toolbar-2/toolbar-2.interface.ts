import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export enum ToolbarItemTypeEnum {
  BUTTON,
  BUTTON_ADD,
  BUTTON_DELETE,
  BUTTON_DOWNLOAD,
  BUTTON_EDIT,
  BUTTON_MOVE,
  BUTTON_REFRESH,
  BUTTON_SAVE,
  BUTTON_SMS,
  BUTTON_UPLOAD,
  BUTTON_BLOCK,
  BUTTON_UNBLOCK,
  BUTTON_CHANGE_STATUS,
  BUTTON_CLOSE,
  BUTTON_UNDO,
  BUTTON_OK,
  BUTTON_REGISTER_CALL,
  BUTTON_VISIT,
  BUTTON_COPY,
  CHECKBOX,
}

export type IToolbarAction = () => void;

export interface IToolbarElement {
  action?: IToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
}

export interface IToolbarButton extends IToolbarElement {
  type: ToolbarItemTypeEnum;
  icon?: string;
  children?: Array<IToolbarElement>;
}

export interface IToolbarCheckbox extends IToolbarElement {
  type: ToolbarItemTypeEnum.CHECKBOX;
  state: Observable<boolean>;
}

export type IToolbarItem = IToolbarButton | IToolbarCheckbox;

export interface IToolbar {
  items: Array<IToolbarItem>;
}
