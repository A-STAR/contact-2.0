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
  'info' |
  'loadFromExcel' |
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

export type IButtonStylesConfig = {
  [K in IButtonStyle]: string;
};

export type IButtonTypesConfig = {
  [K in IButtonType]: {
    icon: string;
    label: string;
  };
};
