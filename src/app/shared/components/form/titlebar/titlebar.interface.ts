import { Observable } from 'rxjs/Observable';

export enum TitlebarItemTypeEnum {
  BUTTON                  = 'button',
  BUTTON_ADD              = 'add',
  BUTTON_ADD_USER         = 'addUser',
  BUTTON_BLOCK            = 'block',
  BUTTON_CHANGE_STATUS    = 'changeStatus',
  BUTTON_CLOSE            = 'close',
  BUTTON_COPY             = 'copy',
  BUTTON_DELETE           = 'delete',
  BUTTON_DOWNLOAD         = 'download',
  BUTTON_EDIT             = 'edit',
  BUTTON_EMAIL            = 'email',
  BUTTON_DOWNLOAD_EXCEL   = 'downloadExcel',
  BUTTON_MOVE             = 'move',
  BUTTON_NEXT             = 'next',
  BUTTON_OK               = 'ok',
  BUTTON_REFRESH          = 'refresh',
  BUTTON_REGISTER_CONTACT = 'registerContact',
  BUTTON_SAVE             = 'save',
  BUTTON_SEARCH           = 'search',
  BUTTON_SMS              = 'sms',
  BUTTON_START            = 'start',
  BUTTON_STOP             = 'stop',
  BUTTON_UNBLOCK          = 'unblock',
  BUTTON_UNDO             = 'undo',
  BUTTON_UPLOAD           = 'upload',
  BUTTON_VERSION          = 'version',
  BUTTON_VISIT            = 'visit',
  CHECKBOX                = 'checkbox',
}

export type ITitlebarAction = () => void;

export interface ITitlebarElement {
  action?: ITitlebarAction;
  enabled?: Observable<boolean>;
  title?: string;
  align?: 'right' | 'left';
}

export interface ITitlebarButton extends ITitlebarElement {
  type: TitlebarItemTypeEnum;
  iconCls?: string;
  children?: Array<ITitlebarElement>;
}

export interface ITitlebarCheckbox extends ITitlebarElement {
  type: TitlebarItemTypeEnum.CHECKBOX;
  state: Observable<boolean>;
}

export type ITitlebarItem = ITitlebarButton | ITitlebarCheckbox;

export interface ITitlebar {
  title?: string;
  items?: Array<ITitlebarItem>;
}
