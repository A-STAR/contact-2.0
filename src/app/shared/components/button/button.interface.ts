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
