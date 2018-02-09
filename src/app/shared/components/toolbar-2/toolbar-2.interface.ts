import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export enum ToolbarItemTypeEnum {
  BUTTON,
  BUTTON_ADD,
  BUTTON_ADD_USER,
  BUTTON_BLOCK,
  BUTTON_CALL,
  BUTTON_CHANGE_STATUS,
  BUTTON_CLOSE,
  BUTTON_COPY,
  BUTTON_DELETE,
  BUTTON_DOWNLOAD,
  BUTTON_DROP,
  BUTTON_EDIT,
  BUTTON_EMAIL,
  BUTTON_EXCEL_LOAD,
  BUTTON_INFO,
  BUTTON_MOVE,
  BUTTON_NEXT,
  BUTTON_OK,
  BUTTON_PAUSE,
  BUTTON_RESUME,
  BUTTON_REFRESH,
  BUTTON_REGISTER_CONTACT,
  BUTTON_SAVE,
  BUTTON_SMS,
  BUTTON_START,
  BUTTON_STOP,
  BUTTON_TRANSFER,
  BUTTON_UNBLOCK,
  BUTTON_UNDO,
  BUTTON_UPLOAD,
  BUTTON_VERSION,
  BUTTON_VISIT,
  CHECKBOX,
}

export type IToolbarAction = () => void;

export interface IToolbarElement {
  action?: IToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
  align?: 'right';
  // TODO(i.lobanov): move it to some type which would work with IToolbarItem
  closeOnClick?: boolean;
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
