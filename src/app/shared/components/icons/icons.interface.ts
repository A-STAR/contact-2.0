export type IconType =
  'add' |
  'addProperty' |
  'addUser' |
  'back' |
  'block' |
  'call' |
  'callPause' |
  'cancel' |
  'change' |
  'changeStatus' |
  'clear' |
  'close' |
  'copy' |
  'debtCard' |
  'delete' |
  'download' |
  'drop' |
  'edit' |
  'email' |
  'exportToExcel' |
  'filter' |
  'info' |
  'loadFromExcel' |
  'map' |
  'move' |
  'next' |
  'ok' |
  'pause' |
  'resume' |
  'refresh' |
  'registerContact' |
  'save' |
  'search' |
  'select' |
  'sms' |
  'start' |
  'stop' |
  'transfer' |
  'unblock' |
  'undo' |
  'upload' |
  'version' |
  'visit';
export enum NiceIconType {
CHECKBOX_TYPE = '',
ok = 'ok',

}
export type IconsConfig = {
  [k in IconType]: string;
};

