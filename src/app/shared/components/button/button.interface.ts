export type IButtonStyle =
  'none' |
  'default' |
  'primary' |
  'secondary' |
  'warning' |
  'danger';

export type IButtonStylesConfig = {
  [K in IButtonStyle]: string;
};

export enum ButtonType {
  NONE              = 'none',
  ADD               = 'add',
  ADD_PROPERTY      = 'addProperty',
  ADD_USER          = 'addUser',
  BACK              = 'back',
  BLOCK             = 'block',
  CALL              = 'call',
  CALL_PAUSE        = 'callPause',
  CANCEL            = 'cancel',
  CHANGE            = 'change',
  CHANGE_STATUS     = 'changeStatus',
  CLEAR             = 'clear',
  CLOSE             = 'close',
  COPY              = 'copy',
  DEBT_CARD         = 'debtCard',
  DELETE            = 'delete',
  DOWNLOAD          = 'download',
  DOWNLOAD_EXCEL    = 'downloadExcel',
  DROP              = 'drop',
  EMAIL             = 'email',
  EDIT              = 'edit',
  EXPORT_TO_EXCEL   = 'exportToExcel',
  FILTER            = 'filter',
  INFO              = 'info',
  LOAD_FROM_EXCEL   = 'loadFromExcel',
  MAP               = 'map',
  MOVE              = 'move',
  NEXT              = 'next',
  OK                = 'ok',
  PAUSE             = 'pause',
  REFRESH           = 'refresh',
  REGISTER_CONTACT  = 'registerContact',
  RESUME            = 'resume',
  SAVE              = 'save',
  SEARCH            = 'search',
  SELECT            = 'select',
  START             = 'start',
  STOP              = 'stop',
  SMS               = 'sms',
  TRANSFER          = 'transfer',
  UNBLOCK           = 'unblock',
  UNDO              = 'undo',
  UPLOAD            = 'upload',
  VERSION           = 'version',
  VISIT             = 'visit',
}

export interface ButtonConfig {
  label?: string;
  iconCls?: string;
}

