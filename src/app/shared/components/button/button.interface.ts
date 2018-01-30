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
  'email' |
  'exportToExcel' |
  'loadFromExcel' |
  'move' |
  'next' |
  'ok' |
  'refresh' |
  'registerContact' |
  'save' |
  'search' |
  'select' |
  'sms' |
  'start' |
  'stop' |
  'unblock' |
  'undo' |
  'upload' |
  'version' |
  'visit';

export type IButtonStylesConfig = {
  [K in IButtonStyle]: string;
};

export type IButtonTypesConfig = {
  [K in IButtonType]: {
    icon: string;
    label: string;
  };
};
