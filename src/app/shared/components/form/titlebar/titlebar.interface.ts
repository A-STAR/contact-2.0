import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export enum TitlebarItemTypeEnum {
  BUTTON,
  BUTTON_ADD,
  BUTTON_ADD_USER,
  BUTTON_BLOCK,
  BUTTON_CHANGE_STATUS,
  BUTTON_CLOSE,
  BUTTON_COPY,
  BUTTON_DELETE,
  BUTTON_DOWNLOAD,
  BUTTON_EDIT,
  BUTTON_EMAIL,
  BUTTON_EXCEL_LOAD,
  BUTTON_MOVE,
  BUTTON_NEXT,
  BUTTON_OK,
  BUTTON_REFRESH,
  BUTTON_REGISTER_CONTACT,
  BUTTON_SAVE,
  BUTTON_SMS,
  BUTTON_START,
  BUTTON_STOP,
  BUTTON_UNBLOCK,
  BUTTON_UNDO,
  BUTTON_UPLOAD,
  BUTTON_VERSION,
  BUTTON_VISIT,
  CHECKBOX,
}

export type ITitlebarAction = () => void;

export interface ITitlebarElement {
  action?: ITitlebarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
  align?: 'right';
}

export interface ITitlebarButton extends ITitlebarElement {
  type: TitlebarItemTypeEnum;
  icon?: string;
  children?: Array<ITitlebarElement>;
}

export interface ITitlebarCheckbox extends ITitlebarElement {
  type: TitlebarItemTypeEnum.CHECKBOX;
  state: Observable<boolean>;
}

export type ITitlebarItem = ITitlebarButton | ITitlebarCheckbox;

export interface ITitlebar {
  items: Array<ITitlebarItem>;
}
