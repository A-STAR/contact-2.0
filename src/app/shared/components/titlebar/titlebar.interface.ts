import { Observable } from 'rxjs/Observable';

export enum ToolbarItemType {
  BUTTON                  = 'button',
  BUTTON_ADD              = 'add',
  BUTTON_ADD_USER         = 'addUser',
  BUTTON_BLOCK            = 'block',
  BUTTON_CHANGE_STATUS    = 'changeStatus',
  BUTTON_CLOSE            = 'close',
  BUTTON_COPY             = 'copy',
  BUTTON_DELETE           = 'delete',
  BUTTON_DEBT_CARD        = 'debtCard',
  BUTTON_DOWNLOAD         = 'download',
  BUTTON_EDIT             = 'edit',
  BUTTON_EMAIL            = 'email',
  BUTTON_FILTER           = 'filter',
  BUTTON_DOWNLOAD_EXCEL   = 'downloadExcel',
  BUTTON_MAP              = 'map',
  BUTTON_MASS             = 'mass',
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

export type ITitlebarAction = (item?: ITitlebarElement) => void;

export interface ITitlebarElement {
  action?: ITitlebarAction;
  align?: 'right' | 'left';
  classes?: Observable<string>;
  enabled?: Observable<boolean>;
  title?: string;
  children?: ITitlebarElement[];
}

export interface ITitlebarButton extends ITitlebarElement {
  type: ToolbarItemType;
  children?: ITitlebarElement[];
  iconCls?: string;
}

export interface ITitlebarCheckbox extends ITitlebarElement {
  type: ToolbarItemType.CHECKBOX;
  state: Observable<boolean>;
}

export type ITitlebarItem = ITitlebarButton | ITitlebarCheckbox;

export interface ITitlebar {
  noBorder?: boolean;
  items?: ITitlebarItem[];
  title?: string;
  // false by default
  suppressCenterZone?: boolean;
  suppressBorder?: boolean;
}
