export enum AreaLayout {
  ROW    = 'row',
  COLUMN = 'column',
}

export interface IDragData {
  i: number;
  lSize: number;
  rSize: number;
  start: number;
}
