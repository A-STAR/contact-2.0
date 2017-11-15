export type IButtonStyle =
  'none' |
  'default' |
  'primary' |
  'secondary' |
  'warning' |
  'danger';

export type IButtonType =
  'add' |
  'addUser' |
  'back' |
  'block' |
  'cancel' |
  'change' |
  'changeStatus' |
  'clear' |
  'close' |
  'copy' |
  'delete' |
  'download' |
  'edit' |
  'exportToExcel' |
  'move' |
  'next' |
  'ok' |
  'refresh' |
  'registerContact' |
  'save' |
  'search' |
  'select' |
  'sms' |
  'unblock' |
  'undo' |
  'upload' |
  'visit'|
  'start' |
  'stop';

export type IButtonStylesConfig = {
  [K in IButtonStyle]: string;
};

export type IButtonTypesConfig = {
  [K in IButtonType]: {
    icon: string;
    label: string;
  };
};
