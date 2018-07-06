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
  ADD               = 'add',
  ADDPROPERTY       = 'addProperty',
  ADDUSER           = 'addUser',
  BACK              = 'back',
  BLOCK             = 'block',
  CALL              = 'call',
  CALLPAUSE         = 'callPause',
  CANCEL            = 'cancel',
  CHANGE            = 'change',
  CHANGESTATUS      = 'changeStatus',
  CLEAR             = 'clear',
  CLOSE             = 'close',
  COPY              = 'copy',
  DEBTCARD          = 'debtCard',
  DELETE            = 'delete',
  DOWNLOAD          = 'download',
  DROP              = 'drop',
  EMAIL             = 'email',
  EDIT              = 'edit',
  EXPORTTOEXCEL     = 'exportToExcel',
  FILTER            = 'filter',
  INFO              = 'info',
  LOADFROMEXCEL     = 'loadFromExcel',
  MAP               = 'map',
  MOVE              = 'move',
  NEXT              = 'next',
  OK                = 'ok',
  PAUSE             = 'pause',
  REFRESH           = 'refresh',
  REGISTERCONTACT   = 'registerContact',
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
