export enum IAreaLayout {
  ROW    = 'row',
  COLUMN = 'column',
}

export interface IDragData {
  i: number;
  lSize: number;
  rSize: number;
  start: number;
}
